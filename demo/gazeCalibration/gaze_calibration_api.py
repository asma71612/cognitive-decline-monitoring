# http://localhost:5000/gaze-calibration-test
import numpy as np
import subprocess
import threading
import time
import re
import os
import json
import csv
import pandas as pd
from pycaret.regression import *
import random
from sklearn.metrics import mean_absolute_error

# Global variables
process = None
grid_points = {}
calibration_x = False
calibration_y = False
attempts = 0
max_attempts = 2
log_file_path = os.path.join(os.path.dirname(__file__), "gaze_calibration_dummy.log")
csv_file_path = os.path.join(os.path.dirname(__file__), "gaze_calibration_collection_train.csv")
csv_test_file_path = os.path.join(os.path.dirname(__file__), "gaze_calibration_collection_unseen.csv")

def start_gaze_tracking():
    """Start the ptgaze eye tracking process"""
    global process, log_file_path
    
    # Create empty log file
    try:
        with open(log_file_path, "w") as f:
            pass  # Create empty file
        print(f"Created empty log file: {log_file_path}")
    except Exception as e:
        print(f"Error creating log file: {e}")
        return {"success": False, "error": str(e)}
    
    # Set environment variable for ptgaze
    os.environ['PTGAZE_CALIBRATION_DIR'] = os.path.dirname(os.path.abspath(__file__))
    
    # Start the eye-tracking process
    eye_tracking_command = ["/Users/asma.ansari/Desktop/capstone/cognitive-decline-monitoring/ptgaze_env/bin/ptgaze", "--mode", "eth-xgaze", "--no-screen"]
    
    try:
        process = subprocess.Popen(
            eye_tracking_command, 
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True, bufsize=1, universal_newlines=True
        )
        
        # Start monitor thread
        monitor_thread = threading.Thread(target=monitor_process, daemon=True)
        monitor_thread.start()
        
        # Wait a moment to check if process started correctly
        time.sleep(1)
        if process.poll() is not None:
            return {
                "success": False,
                "error": f"ptgaze process exited with code {process.returncode}"
            }
            
        # Reset calibration data files
        for path in [csv_file_path, csv_test_file_path]:
            if os.path.exists(path):
                try:
                    if os.path.isdir(path):
                        os.rmdir(path)
                    else:
                        os.remove(path)
                except Exception as e:
                    print(f"Error deleting {path}: {e}")
        
        return {
            "success": True,
            "message": "Eye tracking started successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to start eye tracking: {str(e)}"
        }

def monitor_process():
    """Monitor the ptgaze process output"""
    global process
    try:
        while process and process.poll() is None:
            output = process.stdout.readline()
            if output:
                print(f"ptgaze output: {output.strip()}")
            error = process.stderr.readline()
            if error:
                print(f"ptgaze error: {error.strip()}")
            time.sleep(0.1)
        if process:
            print(f"ptgaze process exited with code: {process.returncode}")
    except Exception as e:
        print(f"Error monitoring ptgaze process: {e}")

def stop_gaze_tracking():
    """Stop the ptgaze eye tracking process"""
    global process
    
    if process and process.poll() is None:
        process.terminate()
        time.sleep(0.5)
        if process.poll() is None:
            process.kill()
        process.wait()
        
    # Clean up log file
    if os.path.exists(log_file_path):
        try:
            os.remove(log_file_path)
        except Exception as e:
            print(f"Error removing log file: {e}")
            
    return {
        "success": True,
        "message": "Eye tracking stopped successfully"
    }

def collect_calibration_point(point_key, x_position, y_position):
    """Collect gaze data for a specific calibration point"""
    global grid_points, log_file_path
    
    # Reset log file
    if os.path.exists(log_file_path):
        os.remove(log_file_path)
        print(f"File '{log_file_path}' deleted successfully.")
    
    # Initialize point data if not exists
    if point_key not in grid_points:
        grid_points[point_key] = {"x_position": x_position, "y_position": y_position}
    
    # Initialize metrics
    for metric in ["vector_x", "vector_y", "vector_z", "gaze_pitch", "gaze_yaw", "roll", "pitch", "yaw", "distance"]:
        grid_points[point_key].setdefault(metric, [])
    
    grid_points[point_key].setdefault("total_frames", 0)
    
    # Start data collection in a separate thread to not block the request
    collection_thread = threading.Thread(
        target=collect_data_from_log,
        args=(point_key, int(point_key.replace('pt', '')) <= 14),  # First 14 points for training
        daemon=True
    )
    collection_thread.start()
    
    return {
        "success": True,
        "message": f"Started collecting data for point {point_key}",
        "point_key": point_key
    }

def collect_data_from_log(point_key, is_training=True):
    """Read gaze data from log file and collect frames"""
    global grid_points, log_file_path
    last_position = 0
    
    while True:
        try:
            with open(log_file_path, "r") as file:
                file.seek(last_position)
                lines = file.readlines()
                last_position = file.tell()
            
            for line in lines:
                line = line.strip()
                
                # Extract Gaze Vector
                gaze_match = re.search(r'Gaze Vector - x: ([\d\-.eE]+), y: ([\d\-.eE]+), z: ([\d\-.eE]+)', line)
                if gaze_match:
                    vector_x, vector_y, vector_z = map(float, gaze_match.groups())
                    grid_points[point_key]["vector_x"].append(vector_x)
                    grid_points[point_key]["vector_y"].append(vector_y)
                    grid_points[point_key]["vector_z"].append(vector_z)
                
                # Extract Gaze Angles
                gaze_match = re.search(r'Gaze Angles - Pitch: ([\d\-.eE]+), Yaw: ([\d\-.eE]+)', line)
                if gaze_match:
                    gaze_pitch, gaze_yaw = map(float, gaze_match.groups())
                    grid_points[point_key]["gaze_pitch"].append(gaze_pitch)
                    grid_points[point_key]["gaze_yaw"].append(gaze_yaw)

                # Extract Head Pose Angles
                head_pose_match = re.search(
                    r'Head Pose - Roll: ([\d\-.eE]+), Pitch: ([\d\-.eE]+), Yaw: ([\d\-.eE]+), Distance: ([\d\-.eE]+)', line
                )
                if head_pose_match:
                    roll, pitch, yaw, distance = map(float, head_pose_match.groups())
                    grid_points[point_key]["roll"].append(roll)
                    grid_points[point_key]["pitch"].append(pitch)
                    grid_points[point_key]["yaw"].append(yaw)
                    grid_points[point_key]["distance"].append(distance)
                    grid_points[point_key]["total_frames"] += 1
            
            # When we have collected enough frames
            if grid_points[point_key]["total_frames"] >= 100:
                print(f"\n✅ 100 frames collected for {point_key}. Stopping process...\n")
                
                # Choose which CSV file to write to based on training or testing
                target_csv = csv_file_path if is_training else csv_test_file_path
                
                # Write data to CSV
                with open(target_csv, "a", newline="") as csvfile:
                    writer = csv.writer(csvfile)
                    
                    # Write header if file is empty
                    if csvfile.tell() == 0:
                        writer.writerow(["Key", "x_position", "y_position", "vector_x", "vector_y", "vector_z",
                                         "gaze_pitch", "gaze_yaw", "roll", "pitch", "yaw", "distance"])
                    
                    # Calculate number of frames to write
                    num_frames = min(
                        len(grid_points[point_key]["vector_x"]),
                        len(grid_points[point_key]["vector_y"]),
                        len(grid_points[point_key]["vector_z"]),
                        len(grid_points[point_key]["gaze_pitch"]),
                        len(grid_points[point_key]["gaze_yaw"]),
                        len(grid_points[point_key]["roll"]),
                        len(grid_points[point_key]["pitch"]),
                        len(grid_points[point_key]["yaw"]),
                        len(grid_points[point_key]["distance"])
                    )
                    
                    x = grid_points[point_key]["x_position"]
                    y = grid_points[point_key]["y_position"]
                    
                    # Write each frame as a row
                    for i in range(num_frames):
                        writer.writerow([
                            point_key,
                            x,
                            y,
                            grid_points[point_key]["vector_x"][i],
                            grid_points[point_key]["vector_y"][i],
                            grid_points[point_key]["vector_z"][i],
                            grid_points[point_key]["gaze_pitch"][i],
                            grid_points[point_key]["gaze_yaw"][i],
                            grid_points[point_key]["roll"][i],
                            grid_points[point_key]["pitch"][i],
                            grid_points[point_key]["yaw"][i],
                            grid_points[point_key]["distance"][i]
                        ])
                
                break
            
            time.sleep(0.5)
            
        except FileNotFoundError:
            print("⚠️ Log file not found, waiting for ptgaze to start writing...")
            time.sleep(1)
        except Exception as e:
            print(f"Error reading log file: {e}")
            time.sleep(1)

def check_calibration_status():
    """Check if all calibration points have been collected"""
    global grid_points
    
    total_points = len(grid_points)
    points_completed = sum(1 for point in grid_points.values() if point.get("total_frames", 0) >= 100)
    
    return {
        "success": True,
        "total_points": total_points,
        "points_completed": points_completed,
        "is_complete": points_completed >= 18  # Assuming we need 18 points
    }

def create_and_train_model():
    """Create and train the calibration models"""
    global calibration_x, calibration_y
    
    try:
        # Load data
        test_df = pd.read_csv(csv_test_file_path)
        train_df = pd.read_csv(csv_file_path)

        # Drop unwanted columns
        train_df.drop(['Key'], axis=1, inplace=True)
        test_df.drop(['Key'], axis=1, inplace=True)

        # Train X Model
        setup(
            index=False,
            data=train_df,
            test_data=test_df,
            target='x_position',
            ignore_features=['y_position'],
            session_id=123,
            verbose=True,
            imputation_type="simple",
            numeric_imputation="mean",
            categorical_imputation="mode",
            polynomial_features=True,
            polynomial_degree=2,
            remove_multicollinearity=True,
            multicollinearity_threshold=0.9,
            transformation=True,
            transformation_method="yeo-johnson",
            normalize=True,
            normalize_method="robust",
            fold_strategy="kfold",
            fold=10,
            n_jobs=1,
            use_gpu=False,
            log_experiment=False
        )
        
        # Use a more standard model that's definitely available
        # Change from catboost to gradient boosting regressor
        x_model = create_model("gbr")  # gradient boosting regressor
        predictions_x = predict_model(x_model, data=test_df)

        mae_x = mean_absolute_error(predictions_x["x_position"], predictions_x["prediction_label"])

        if not calibration_x and mae_x <= 576:
            save_model(finalize_model(x_model), "User_x_model")
            calibration_x = True

        # Train Y Model
        setup(
            index=False,
            data=train_df,
            test_data=test_df,
            target='y_position',
            ignore_features=['x_position'],
            session_id=123,
            verbose=True,
            imputation_type="simple",
            numeric_imputation="mean",
            categorical_imputation="mode",
            polynomial_features=True,
            polynomial_degree=2,
            remove_multicollinearity=True,
            multicollinearity_threshold=0.9,
            transformation=True,
            transformation_method="yeo-johnson",
            normalize=True,
            normalize_method="robust",
            fold_strategy="kfold",
            fold=10,
            n_jobs=1,
            use_gpu=False,
            log_experiment=False
        )
        
        # Keep using huber regressor for y as it seems to be available
        y_model = create_model("huber")
        predictions_y = predict_model(y_model, data=test_df)

        mae_y = mean_absolute_error(predictions_y["y_position"], predictions_y["prediction_label"])

        if not calibration_y and mae_y <= 330:
            save_model(finalize_model(y_model), "User_y_model")
            calibration_y = True
            
        return {
            "success": True,
            "calibration_x": calibration_x,
            "calibration_y": calibration_y,
            "mae_x": mae_x,
            "mae_y": mae_y
        }
    except Exception as e:
        print(f"Error in model training: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def get_calibration_results():
    """Get the results of the calibration"""
    global calibration_x, calibration_y, attempts
    
    # If we haven't run the calibration yet or need to try again
    if not calibration_x or not calibration_y:
        if attempts <= max_attempts:
            print("Starting calibration model training...")
            result = create_and_train_model()
            attempts += 1
            
            if not calibration_x or not calibration_y:
                return {
                    "success": False,
                    "message": f"Calibration attempt {attempts}/{max_attempts+1}",
                    "status": "incomplete",
                    "details": "Model training complete but accuracy requirements not met.",
                    "attempts": attempts,
                    "max_attempts": max_attempts,
                    "calibration_x": calibration_x,
                    "calibration_y": calibration_y,
                    "x_status": "Complete" if calibration_x else "Failed",
                    "y_status": "Complete" if calibration_y else "Failed"
                }
    
    # If calibration is successful
    if calibration_x and calibration_y:
        print("✅ Calibration SUCCESSFUL - Both X and Y models trained correctly!")
        return {
            "success": True,
            "status": "complete",
            "message": "Calibration successful! Both X and Y models trained.",
            "calibration_x": calibration_x,
            "calibration_y": calibration_y
        }
    # If x calibration succeeded but y failed
    elif calibration_x:
        print(f"⚠️ X calibration succeeded but Y calibration failed. Attempt {attempts}/{max_attempts+1}")
        return {
            "success": False,
            "status": "partial",
            "message": f"X calibration succeeded but Y calibration failed. Attempt {attempts}/{max_attempts+1}",
            "attempts": attempts,
            "calibration_x": calibration_x,
            "calibration_y": calibration_y
        }
    # If we've exceeded max attempts
    elif attempts > max_attempts:
        print("🛑 Maximum calibration attempts exceeded!")
        return {
            "success": False,
            "status": "failed",
            "message": "Maximum calibration attempts exceeded",
            "attempts": attempts,
            "max_attempts": max_attempts,
            "calibration_x": calibration_x,
            "calibration_y": calibration_y
        }
    # Fallback response
    else:
        return {
            "success": False,
            "status": "in_progress",
            "message": "Calibration in progress...",
            "attempts": attempts,
            "calibration_x": calibration_x,
            "calibration_y": calibration_y
        } 