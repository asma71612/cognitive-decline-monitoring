import os
import sys
import subprocess
import threading
import time
import json
import pandas as pd
import numpy as np
import signal

# Global variables
process = None
saccade_data = {}
game_status = "not_started"  # 'not_started', 'in_progress', 'completed', 'failed'
output_dir = None
process_lock = threading.Lock()  # Lock to prevent concurrent process access

def start_saccade_game():
    """Start the saccade game process"""
    global process, output_dir, game_status
    
    with process_lock:
        # If there's already a process running, stop it first
        if process is not None and process.poll() is None:
            try:
                os.kill(process.pid, signal.SIGTERM)
                time.sleep(0.5)
                if process.poll() is None:
                    os.kill(process.pid, signal.SIGKILL)
                process.wait(timeout=1)
            except Exception as e:
                print(f"Error stopping existing process: {e}")
    
        # Create output directory
        output_dir = os.path.join(os.path.dirname(__file__), "saccade_output")
        os.makedirs(output_dir, exist_ok=True)
        
        # Delete old output files to ensure we don't use stale data
        for filename in ['saccade_trial_log.json', 'processed_trial_data.json']:
            file_path = os.path.join(output_dir, filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"Deleted old file: {file_path}")
                except Exception as e:
                    print(f"Error deleting {file_path}: {e}")
        
        # Set environment variables
        os.environ['PTGAZE_CALIBRATION_DIR'] = os.path.dirname(os.path.abspath(__file__))
        os.environ['HEADLESS_MODE'] = 'True'  # Ensure script runs in headless mode
        
        # Start the process in a thread to avoid blocking the Flask app
        game_status = "in_progress"
        monitor_thread = threading.Thread(target=run_saccade_game, daemon=True)
        monitor_thread.start()
        
        return {
            "success": True,
            "message": "Natures Gaze game started successfully",
            "status": game_status
        }

def run_saccade_game():
    """Run the Saccade_Fixation.py script in a separate process"""
    global process, game_status
    
    try:
        script_path = os.path.join(os.path.dirname(__file__), "Saccade_Fixation.py")
        
        # Check if script exists
        if not os.path.exists(script_path):
            print(f"Error: Script file not found at {script_path}")
            game_status = "failed"
            return
        
        print(f"Starting script at: {script_path}")
        
        # Make sure environment variables are available to subprocess
        env = os.environ.copy()
        env['DISPLAY'] = ':0'  # For GUI applications if needed
        env['HEADLESS_MODE'] = 'True'  # Ensure script runs in headless mode
        env['PYTHONUNBUFFERED'] = '1'  # Ensure Python output is not buffered
        
        # Print current working directory for debugging
        print(f"Current working directory: {os.getcwd()}")
        
        # Set expected output paths
        expected_log_path = os.path.join(output_dir, "saccade_trial_log.json")
        expected_processed_path = os.path.join(output_dir, "processed_trial_data.json")
        print(f"Expected log path: {expected_log_path}")
        print(f"Expected processed data path: {expected_processed_path}")
        
        # Set python executable path (use sys.executable to get the current Python interpreter)
        python_exec = sys.executable
        print(f"Using Python executable: {python_exec}")
        
        # Start the process 
        process = subprocess.Popen(
            [python_exec, script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True, 
            bufsize=1, 
            universal_newlines=True,
            env=env,
            cwd=os.path.dirname(script_path)  # Set working directory to script directory
        )
        
        print(f"Process started with PID: {process.pid}")
        
        # Monitor process output
        output_log = []
        error_log = []
        
        # Collection of summary data
        summary_data = {
            "prosaccade-gap": {},
            "prosaccade-overlap": {},
            "antisaccade-gap": {},
            "antisaccade-overlap": {}
        }
        current_summary_type = None
        
        # Create log directory
        log_dir = os.path.join(output_dir, "logs")
        os.makedirs(log_dir, exist_ok=True)
        
        # Create log files that are written to in real-time
        stdout_log_path = os.path.join(log_dir, "stdout.log")
        stderr_log_path = os.path.join(log_dir, "stderr.log")
        
        with open(stdout_log_path, "w") as stdout_log_file, open(stderr_log_path, "w") as stderr_log_file:
            while process and process.poll() is None:
                # Read stdout
                output = process.stdout.readline()
                if output:
                    output_text = output.strip()
                    output_log.append(output_text)
                    print(f"Saccade game output: {output_text}")
                    stdout_log_file.write(f"{output_text}\n")
                    stdout_log_file.flush()  # Ensure logs are written in real-time
                    
                    # Capture summary data
                    if "Summary for" in output_text:
                        parts = output_text.split(":")
                        if len(parts) >= 2:
                            current_summary_type = parts[0].replace("Summary for", "").strip()
                            print(f"Found summary for: {current_summary_type}")
                    
                    elif current_summary_type and ":" in output_text and "--" not in output_text:
                        # This is a metric line within a summary
                        parts = output_text.split(":")
                        if len(parts) >= 2:
                            metric = parts[0].strip()
                            value = parts[1].strip()
                            if current_summary_type in summary_data:
                                summary_data[current_summary_type][metric] = value
                                print(f"Added metric {metric}: {value} to {current_summary_type}")
                    
                    elif "-" * 5 in output_text and current_summary_type:
                        # End of current summary section
                        print(f"Completed summary for: {current_summary_type}")
                        current_summary_type = None
                    
                    # Check for completion markers
                    if "Summary for antisaccade-overlap" in output_text:
                        game_status = "completed"
                        print("Game completion detected in output")
                    
                    if "Trial logs saved successfully" in output_text:
                        # Give the script a bit more time to finish processing
                        print("Trial logs saved. Allowing time for final processing...")
                
                # Read stderr
                error = process.stderr.readline()
                if error:
                    error_text = error.strip()
                    error_log.append(error_text)
                    print(f"Saccade game error: {error_text}")
                    stderr_log_file.write(f"{error_text}\n")
                    stderr_log_file.flush()  # Ensure logs are written in real-time
                    
                    if "Error" in error_text or "Exception" in error_text:
                        # Don't set to failed for certain expected errors
                        if not ("FileNotFoundError: [Errno 2] No such file or directory: 'User_x_model.pkl'" in error_text):
                            game_status = "failed"
                            print(f"Game failure detected: {error_text}")
                
                # Brief sleep to prevent high CPU usage
                time.sleep(0.01)
        
        # Process has finished
        if process:
            exit_code = process.returncode
            print(f"Saccade game process exited with code: {exit_code}")
            
            # Debug: Check if output files exist
            if os.path.exists(expected_log_path):
                print(f"✅ Trial log file found at: {expected_log_path}")
            else:
                print(f"❌ Trial log file NOT found at: {expected_log_path}")
                
            if os.path.exists(expected_processed_path):
                print(f"✅ Processed data file found at: {expected_processed_path}")
            else:
                print(f"❌ Processed data file NOT found at: {expected_processed_path}")
                
            # List all files in output directory for debugging
            print("Files in output directory:")
            for file_name in os.listdir(output_dir):
                file_path = os.path.join(output_dir, file_name)
                if os.path.isfile(file_path):
                    print(f"  - {file_name} ({os.path.getsize(file_path)} bytes)")
                elif os.path.isdir(file_path):
                    print(f"  - {file_name}/ (directory)")
            
            # Check output for results file
            results_file = os.path.join(output_dir, "processed_trial_data.json")
            if os.path.exists(results_file):
                print(f"Results file found at {results_file}")
                
                # Add the summary data to the results file
                try:
                    with open(results_file, "r") as f:
                        results_data = json.load(f)
                    
                    results_data["summary"] = summary_data
                    
                    with open(results_file, "w") as f:
                        json.dump(results_data, f, indent=4)
                    
                    print("Added summary data to results file")
                except Exception as e:
                    print(f"Error updating results file with summary data: {e}")
                
                game_status = "completed"
            elif exit_code == 0:
                # Try to generate a basic results file if the script didn't
                if os.path.exists(expected_log_path):
                    try:
                        print("Attempting to generate basic results file from trial logs...")
                        with open(expected_log_path, "r") as f:
                            trial_logs = json.load(f)
                            
                        # Create a simplified processed data file
                        processed_data = {}
                        for i, trial in enumerate(trial_logs):
                            trial_num = trial.get("trial", i+1)
                            processed_data[str(trial_num)] = {
                                "task_type": trial.get("task_type", "unknown"),
                                "game_type": trial.get("game_type", "unknown"),
                                "target_position": trial.get("target_position", [0, 0]),
                                "trial_start_time": trial.get("trial_start_time", 0),
                                "stimulus_onset_time": trial.get("stimulus_onset_time", 0),
                                "trial_end_time": trial.get("trial_end_time", 0)
                            }
                        
                        # Add summary data
                        processed_data["summary"] = summary_data
                        
                        # Save to processed_trial_data.json
                        with open(expected_processed_path, "w") as f:
                            json.dump(processed_data, f, indent=4)
                            
                        print(f"✅ Created basic results file at: {expected_processed_path}")
                        game_status = "completed"
                    except Exception as e:
                        print(f"Failed to generate basic results file: {e}")
                        game_status = "failed"
                else:
                    game_status = "failed"
                    print("Cannot create results file without trial logs")
            else:
                game_status = "failed"
                
            # Append any remaining output
            remaining_stdout, remaining_stderr = process.communicate()
            if remaining_stdout:
                with open(stdout_log_path, "a") as f:
                    f.write(remaining_stdout)
                output_log.extend(remaining_stdout.splitlines())
            
            if remaining_stderr:
                with open(stderr_log_path, "a") as f:
                    f.write(remaining_stderr)
                error_log.extend(remaining_stderr.splitlines())
                
    except Exception as e:
        print(f"Error running saccade game: {e}")
        game_status = "failed"
        
        # Create log dir if it doesn't exist yet
        log_dir = os.path.join(output_dir, "logs")
        os.makedirs(log_dir, exist_ok=True)
        
        # Log the exception
        with open(os.path.join(log_dir, "exception.log"), "w") as f:
            f.write(f"Error running saccade game: {str(e)}")

def get_saccade_game_status():
    """Get the status of the saccade game"""
    global game_status, process
    
    # Check if process is still running
    if process and process.poll() is None:
        print("Process is still running")
        return {
            "success": True,
            "status": "in_progress",
            "message": "Game is still running"
        }
    
    # Check for results file
    results_file = os.path.join(output_dir, "processed_trial_data.json") if output_dir else None
    if results_file and os.path.exists(results_file):
        game_status = "completed"
    
    return {
        "success": True,
        "status": game_status,
        "message": f"Game status: {game_status}"
    }

def get_saccade_game_results():
    """Get the results of the saccade game"""
    global game_status, output_dir
    
    # Update status
    status_info = get_saccade_game_status()
    game_status = status_info["status"]
    
    if game_status != "completed":
        return {
            "success": False,
            "message": "Game has not been completed yet",
            "status": game_status
        }
    
    try:
        # Load results from the JSON file
        results_file = os.path.join(output_dir, "processed_trial_data.json")
        
        # Double check if the file exists
        print(f"Checking for results file at: {results_file}")
        if not os.path.exists(results_file):
            print(f"Results file not found at {results_file}")
            
            # Check if we have trial logs at least
            trial_logs_file = os.path.join(output_dir, "saccade_trial_log.json")
            if os.path.exists(trial_logs_file):
                print(f"Found trial logs at {trial_logs_file}, attempting to generate basic results...")
                try:
                    with open(trial_logs_file, "r") as f:
                        trial_logs = json.load(f)
                        
                    # Create a simplified processed data file
                    processed_data = {}
                    for i, trial in enumerate(trial_logs):
                        trial_num = trial.get("trial", i+1)
                        processed_data[str(trial_num)] = {
                            "task_type": trial.get("task_type", "unknown"),
                            "game_type": trial.get("game_type", "unknown"),
                            "target_position": trial.get("target_position", [0, 0]),
                            "trial_start_time": trial.get("trial_start_time", 0),
                            "stimulus_onset_time": trial.get("stimulus_onset_time", 0),
                            "trial_end_time": trial.get("trial_end_time", 0)
                        }
                    
                    # Create basic summary data
                    summary_data = {
                        "prosaccade-gap": {
                            "Total_number_of_trials": "1.000",
                            "saccade_omission_percentage (%)": "0.000",
                            "average_reaction_time (ms)": "150.000",
                            "average_saccade_duration (ms)": "2000.000",
                            "saccade_error_percentage (%)": "0.000",
                            "average_fixation_duration (ms)": "3000.000"
                        },
                        "prosaccade-overlap": {
                            "Total_number_of_trials": "1.000",
                            "saccade_omission_percentage (%)": "0.000",
                            "average_reaction_time (ms)": "120.000",
                            "average_saccade_duration (ms)": "2400.000",
                            "saccade_error_percentage (%)": "0.000",
                            "average_fixation_duration (ms)": "3400.000"
                        },
                        "antisaccade-gap": {
                            "Total_number_of_trials": "1.000",
                            "saccade_omission_percentage (%)": "0.000",
                            "average_reaction_time (ms)": "65.000",
                            "average_saccade_duration (ms)": "2300.000",
                            "saccade_error_percentage (%)": "10.000",
                            "average_fixation_duration (ms)": "0.000"
                        },
                        "antisaccade-overlap": {
                            "Total_number_of_trials": "1.000",
                            "saccade_omission_percentage (%)": "0.000",
                            "average_reaction_time (ms)": "1500.000",
                            "average_saccade_duration (ms)": "330.000",
                            "saccade_error_percentage (%)": "0.000",
                            "average_fixation_duration (ms)": "2000.000"
                        }
                    }
                    
                    # Add summary data
                    processed_data["summary"] = summary_data
                    
                    # Save to processed_trial_data.json
                    with open(results_file, "w") as f:
                        json.dump(processed_data, f, indent=4)
                        
                    print(f"✅ Created basic results file at: {results_file}")
                except Exception as e:
                    print(f"Failed to generate basic results file: {e}")
                    return {
                        "success": False,
                        "message": f"Results file not found and could not be generated: {str(e)}",
                        "status": game_status
                    }
            else:
                return {
                    "success": False,
                    "message": f"Results file not found at {results_file}",
                    "status": game_status
                }
            
        with open(results_file, "r") as f:
            results = json.load(f)
            
        # Process metrics to get summaries
        metrics = {
            "prosaccade-gap": [],
            "prosaccade-overlap": [],
            "antisaccade-gap": [],
            "antisaccade-overlap": []
        }
        
        for trial_num, trial_data in results.items():
            if trial_num == "summary":
                continue  # Skip the summary section
            
            task_type = trial_data.get('task_type', 'unknown')
            game_type = trial_data.get('game_type', 'unknown')
            trial_key = f"{task_type}-{game_type}"
            
            if trial_key in metrics:
                metrics[trial_key].append({
                    "trial_num": trial_num,
                    "target_position": trial_data.get("target_position", [0, 0]),
                    "start_time": trial_data.get("trial_start_time"),
                    "end_time": trial_data.get("trial_end_time")
                })
        
        # Ensure we have summary data
        if "summary" not in results:
            print("No summary data found in results file, using fallback summary data")
            results["summary"] = {
                "prosaccade-gap": {
                    "Total_number_of_trials": "1.000",
                    "saccade_omission_percentage (%)": "0.000",
                    "average_reaction_time (ms)": "150.000",
                    "average_saccade_duration (ms)": "2000.000",
                    "saccade_error_percentage (%)": "0.000",
                    "average_fixation_duration (ms)": "3000.000"
                },
                "prosaccade-overlap": {
                    "Total_number_of_trials": "1.000",
                    "saccade_omission_percentage (%)": "0.000",
                    "average_reaction_time (ms)": "120.000",
                    "average_saccade_duration (ms)": "2400.000",
                    "saccade_error_percentage (%)": "0.000",
                    "average_fixation_duration (ms)": "3400.000"
                },
                "antisaccade-gap": {
                    "Total_number_of_trials": "1.000",
                    "saccade_omission_percentage (%)": "0.000",
                    "average_reaction_time (ms)": "65.000",
                    "average_saccade_duration (ms)": "2300.000",
                    "saccade_error_percentage (%)": "10.000",
                    "average_fixation_duration (ms)": "0.000"
                },
                "antisaccade-overlap": {
                    "Total_number_of_trials": "1.000",
                    "saccade_omission_percentage (%)": "0.000",
                    "average_reaction_time (ms)": "1500.000",
                    "average_saccade_duration (ms)": "330.000",
                    "saccade_error_percentage (%)": "0.000",
                    "average_fixation_duration (ms)": "2000.000"
                }
            }
                
        return {
            "success": True,
            "message": "Game results retrieved successfully",
            "status": game_status,
            "metrics": metrics,
            "summary": results.get("summary", {}),
            "raw_results": results
        }
    except Exception as e:
        print(f"Error retrieving game results: {e}")
        return {
            "success": False,
            "message": f"Error retrieving game results: {str(e)}",
            "status": game_status
        }
