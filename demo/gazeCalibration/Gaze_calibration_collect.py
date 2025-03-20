import numpy as np
import tkinter as tk
import subprocess
import threading
import time
from functools import partial
from screeninfo import get_monitors
import itertools
import re
import os
import json
import csv
import pandas as pd
from pycaret.regression import *
from sklearn.metrics import mean_absolute_error
import random

# Define the CSV file path
csv_file_path = os.path.join(os.path.dirname(__file__), "gaze_calibration_collection_train.csv")
csv_test_file_path = os.path.join(os.path.dirname(__file__), "gaze_calibration_collection_unseen.csv")
log_file_path = os.path.join(os.path.dirname(__file__), "gaze_calibration_dummy.log")  # File where ptgaze writes data

# Create empty log files to ensure ptgaze can write to them
try:
    with open(log_file_path, "w") as f:
        pass  # Create empty file
    print(f"Created empty log file: {log_file_path}")
except Exception as e:
    print(f"Error creating log file: {e}")

global calibration_x, calibration_y, attempts, max_attempts

attempts = 0
calibration_x = False
calibration_y= False
max_attempts = 2

#------------------Start eye-tracking command and delet previous logs----------------#
# Set environment variable for ptgaze to know where to save logs
os.environ['PTGAZE_CALIBRATION_DIR'] = os.path.dirname(os.path.abspath(__file__))

eye_tracking_command = ["/Users/asma.ansari/Desktop/capstone/cognitive-decline-monitoring/ptgaze_env/bin/ptgaze", "--mode", "eth-xgaze", "--no-screen"]  # Use full path for macOS
    
# Start the eye-tracking process
print(f"Starting ptgaze process with command: {eye_tracking_command}")
process = subprocess.Popen(
    eye_tracking_command, 
    stdout=subprocess.PIPE,  # Capture output instead of hiding it
    stderr=subprocess.PIPE,  # Capture errors too
    text=True, bufsize=1, universal_newlines=True
)

# Create a thread to monitor the process output
def monitor_process():
    """Monitor the ptgaze process output to check if it's running properly."""
    try:
        while process.poll() is None:  # While process is still running
            output = process.stdout.readline()
            if output:
                print(f"ptgaze output: {output.strip()}")
            error = process.stderr.readline()
            if error:
                print(f"ptgaze error: {error.strip()}")
            time.sleep(0.1)
        print(f"ptgaze process exited with code: {process.returncode}")
    except Exception as e:
        print(f"Error monitoring ptgaze process: {e}")

# Start a thread to monitor the ptgaze process
monitor_thread = threading.Thread(target=monitor_process, daemon=True)
monitor_thread.start()

# Check if process is running
time.sleep(1)  # Give it a moment to start
if process.poll() is not None:
    print(f"⚠️ WARNING: ptgaze process exited with code {process.returncode}")
    print("This may cause the application to not function properly.")
else:
    print("✅ ptgaze process started successfully")

# Check if files exist before deleting them
# Safely delete old log files
for path in [log_file_path, csv_file_path, csv_test_file_path]:
    if os.path.exists(path):
        try:
            if os.path.isdir(path):
                os.rmdir(path)  # For directories
                print(f"Deleted directory: {path}")
            else:
                os.remove(path)  # For files
                print(f"Deleted file: {path}")
        except Exception as e:
            print(f"Error deleting {path}: {e}")

#-------------- on click trigger, calls this function to store gaze data -----------#
def on_click(event, dot, shadow):
    global countdown_running, overlay
    
    # Check if file exists before deleting
    if os.path.exists(log_file_path):
        os.remove(log_file_path)
        print(f"✅ File '{log_file_path}' deleted successfully.")
    else:
        print(f"⚠️ File '{log_file_path}' does not exist.")
    
    """Simulate button press by moving and changing color"""

    # Simulate Click Effect
    canvas.itemconfig(dot, fill="darkred")  
    canvas.move(dot, 0, 3)  
    canvas.move(shadow, 0, 3)  
    
    overlay = disable_canvas()
    
    # Start countdown while processing is happening
    countdown_running = True
    start_countdown(dot)

    # Identify which point was clicked using the shortest distance
    selected_key = grid_point_keys[current_point_index]
    print("YOU SELECTED THE POINT:", selected_key)

    if selected_key is None:
        print("❌ No point detected.")
        return  # Exit function early

    # Ensure data storage exists for the selected point
    for metric in ["vector_x","vector_y","vector_z", "gaze_pitch", "gaze_yaw", "roll", "pitch", "yaw", "distance"]:
        grid_points[selected_key].setdefault(metric, [])
    
    grid_points[selected_key].setdefault("total_frames", 0)  # Ensure total_frames is an integer
    
    #**Function to read gaze data from the file in real-time**
    def read_from_log():
        global countdown_running, current_point_index, overlay
        last_position = 0

        while True:
            
            try:
                with open(log_file_path, "r") as file:
                    file.seek(last_position)  # Start reading from the last read position
                    lines = file.readlines()
                    last_position = file.tell()  # Save the last read position

                for line in lines:
                    line = line.strip()
                    print(line)  # Debugging output

                    
                    # Extract Gaze Vector
                    gaze_match = re.search(r'Gaze Vector - x: ([\d\-.eE]+), y: ([\d\-.eE]+), z: ([\d\-.eE]+)', line)
                    if gaze_match:
                        vector_x, vector_y, vector_z = map(float, gaze_match.groups())
                        grid_points[selected_key]["vector_x"].append(vector_x)
                        grid_points[selected_key]["vector_y"].append(vector_y)
                        grid_points[selected_key]["vector_z"].append(vector_z)
                    
                    # Extract Gaze Angles
                    gaze_match = re.search(r'Gaze Angles - Pitch: ([\d\-.eE]+), Yaw: ([\d\-.eE]+)', line)
                    if gaze_match:
                        gaze_pitch, gaze_yaw = map(float, gaze_match.groups())
                        grid_points[selected_key]["gaze_pitch"].append(gaze_pitch)
                        grid_points[selected_key]["gaze_yaw"].append(gaze_yaw)

                    # Extract Head Pose Angles
                    head_pose_match = re.search(
                        r'Head Pose - Roll: ([\d\-.eE]+), Pitch: ([\d\-.eE]+), Yaw: ([\d\-.eE]+), Distance: ([\d\-.eE]+)', line
                    )
                    if head_pose_match:
                        roll, pitch, yaw, distance = map(float, head_pose_match.groups())
                        grid_points[selected_key]["roll"].append(roll)
                        grid_points[selected_key]["pitch"].append(pitch)
                        grid_points[selected_key]["yaw"].append(yaw)
                        grid_points[selected_key]["distance"].append(distance)
                        grid_points[selected_key]["total_frames"] += 1  # Count frames when a gaze angle is found

                # When you finish collecting 100 frames for the selected_key:
                if grid_points[selected_key]["total_frames"] >= 100:
                    # Terminate the process, etc.
                    print(f"\n✅ 100 frames collected for {selected_key}. Stopping process...\n")
                    file.close()
                    
                    if current_point_index < 14: 
                    
                        # Write the data for the current key to the CSV file
                        # Open in append mode so you add a new row for each point
                        # Open the CSV in write mode and create a writer
                        with open(csv_file_path, "a", newline="") as csvfile:
                            writer = csv.writer(csvfile)
                            
                            # Write the header row
                            if csvfile.tell() == 0:
                                writer.writerow(["Key", "x_position", "y_position", "vector_x","vector_y","vector_z",
                                                "gaze_pitch", "gaze_yaw", "roll", "pitch", "yaw", "distance"])
                            
                            # The number of frames is typically the length of one of your data lists,
                            # such as gaze_pitch
                            num_frames = num_frames = min(
                                                            len(grid_points[selected_key]["vector_x"]),
                                                            len(grid_points[selected_key]["vector_y"]),
                                                            len(grid_points[selected_key]["vector_z"]),
                                                            len(grid_points[selected_key]["gaze_pitch"]),
                                                            len(grid_points[selected_key]["gaze_yaw"]),
                                                            len(grid_points[selected_key]["roll"]),
                                                            len(grid_points[selected_key]["pitch"]),
                                                            len(grid_points[selected_key]["yaw"]),
                                                            len(grid_points[selected_key]["distance"])
                                                        )
                            
                            # Iterate through each point in your grid_points dictionary
                            x = grid_points[selected_key]["x_position"]
                            y = grid_points[selected_key]["y_position"]
                                
                            # For each frame, write a row
                            for i in range(num_frames):
                                writer.writerow([
                                    selected_key,              # The point's key (e.g., Pt1, Pt2, etc.)
                                    x,                # x_position for that point
                                    y,                # y_position for that point
                                    grid_points[selected_key]["vector_x"][i],
                                    grid_points[selected_key]["vector_y"][i],
                                    grid_points[selected_key]["vector_z"][i],
                                    grid_points[selected_key]["gaze_pitch"][i],
                                    grid_points[selected_key]["gaze_yaw"][i],
                                    grid_points[selected_key]["roll"][i],
                                    grid_points[selected_key]["pitch"][i],
                                    grid_points[selected_key]["yaw"][i],
                                    grid_points[selected_key]["distance"][i]
                                ])
                        csvfile.close()
                    else:
                        # Write the data for the current key to the CSV file
                        # Open in append mode so you add a new row for each point
                        # Open the CSV in write mode and create a writer
                        with open(csv_test_file_path, "a", newline="") as csvfile2:
                            writer = csv.writer(csvfile2)
                            
                            # Write the header row
                            if csvfile2.tell() == 0:
                                writer.writerow(["Key", "x_position", "y_position", "vector_x","vector_y","vector_z",
                                                "gaze_pitch", "gaze_yaw", "roll", "pitch", "yaw", "distance"])
                            
                            # The number of frames is typically the length of one of your data lists,
                            # such as gaze_pitch
                            num_frames = num_frames = min(
                                                            len(grid_points[selected_key]["vector_x"]),
                                                            len(grid_points[selected_key]["vector_y"]),
                                                            len(grid_points[selected_key]["vector_z"]),
                                                            len(grid_points[selected_key]["gaze_pitch"]),
                                                            len(grid_points[selected_key]["gaze_yaw"]),
                                                            len(grid_points[selected_key]["roll"]),
                                                            len(grid_points[selected_key]["pitch"]),
                                                            len(grid_points[selected_key]["yaw"]),
                                                            len(grid_points[selected_key]["distance"])
                                                        )
                            
                            # Iterate through each point in your grid_points dictionary
                            x = grid_points[selected_key]["x_position"]
                            y = grid_points[selected_key]["y_position"]
                                
                            # For each frame, write a row
                            for i in range(num_frames):
                                writer.writerow([
                                    selected_key,              # The point's key (e.g., Pt1, Pt2, etc.)
                                    x,                # x_position for that point
                                    y,                # y_position for that point
                                    grid_points[selected_key]["vector_x"][i],
                                    grid_points[selected_key]["vector_y"][i],
                                    grid_points[selected_key]["vector_z"][i],
                                    grid_points[selected_key]["gaze_pitch"][i],
                                    grid_points[selected_key]["gaze_yaw"][i],
                                    grid_points[selected_key]["roll"][i],
                                    grid_points[selected_key]["pitch"][i],
                                    grid_points[selected_key]["yaw"][i],
                                    grid_points[selected_key]["distance"][i]
                                ])
                        csvfile2.close()
                        
                    
                    # **Now Check If All Points Have Data**
                    if check_all_points_clicked():
                        countdown_running = False
                        print("\n✅ All points have enough data. Proceeding to calculations!\n")
                        show_loading_screen()  # Show full-screen overlay
                        root.after(1000, check_calibration)
                        
                    else:
                        print("❌ Not all points have enough data yet.")
                        countdown_running = False
                        current_point_index += 1
                        fade_out(dot, shadow, steps=10, delay=100)
                        enable_canvas(overlay)

                    break  # Exit loop

                time.sleep(0.5)  # Small delay to avoid excessive CPU usage

            except FileNotFoundError:
                print("⚠️ Log file not found, waiting for ptgaze to start writing...")
                time.sleep(5)


    # Start reading from the log file in a separate thread
    log_thread = threading.Thread(target=read_from_log, daemon=True)
    log_thread.start()

    root.after(150, lambda: reset_dot(dot, shadow))  # Restore dot after short delay
    
def on_canvas_close(event):
    global process
    """Triggered when the canvas is destroyed."""
    print("🛑 Program is closing... Checking for file deletion.")
    
    # If eye tracking is still running, then terminate it
    if process.poll() is None:
        process.terminate()
        if process.poll() is None:
            process.kill()
    process.wait()

    # Check if file exists before deleting
    if os.path.exists(log_file_path):
        os.remove(log_file_path)
        print(f"✅ File '{log_file_path}' deleted successfully.")
    else:
        print(f"⚠️ File '{log_file_path}' does not exist.")

#---------------------------- Gaze Calibration Screen Setup -------------------------#
# Get primary display
primary_monitor = get_monitors()[0]  # First monitor is usually primary

root = tk.Tk()

# Set Tkinter window to primary monitor's size
root.geometry(f"{primary_monitor.width}x{primary_monitor.height}+{primary_monitor.x}+{primary_monitor.y}")

canvas = tk.Canvas(root, width=primary_monitor.width, height=primary_monitor.height, bg="white")
canvas.pack(fill="both", expand=True)

# Bind the destroy event to the canvas
canvas.bind("<Destroy>", on_canvas_close)

width = root.winfo_screenwidth()
height = root.winfo_screenheight()

# Set margins (10% of screen size to prevent points being too close to edges)
margin_x = int(width * 0.05)  
margin_y = int(height * 0.05)  

# Define number of columns and rows for the grid
cols = 4  # X-axis division
rows = 3  # Y-axis division

# Compute evenly spaced X and Y coordinates
x_positions = np.linspace(margin_x, width - margin_x, cols)
y_positions = np.linspace(margin_y, height - margin_y, rows)

grid_points = {} # dictionary to store coordinates of points
index = 1  # Start index

# Add the 12 evenly spaced points
for y in y_positions:
    for x in x_positions:
        grid_points[f"pt{index}"] = {"x_position": int(x), "y_position": int(y)}
        index += 1  # Increment index

num_points = 6  # Number of randomized points

# Add random points for testing (keeping track of the index)
for _ in range(num_points):
    random_x = random.randint(margin_x, width - margin_x)
    random_y = random.randint(margin_y, height - margin_y)
    grid_points[f"pt{index}"] = {"x_position": random_x, "y_position": random_y}
    index += 1  # Continue incrementing index


def reset_dot(dot, shadow):
    """Reset dot to original position and color"""
    canvas.itemconfig(dot, fill="#ff5555")  # Restore original color
    canvas.move(dot, 0, -3)  # Move dot back up
    canvas.move(shadow, 0, -3)  # Move shadow back up

def show_loading_screen():
    
    """Create a semi-transparent overlay and a visually appealing loading screen."""
    global loading_overlay, loading_window, animation_frames

    # Ensure previous overlay is removed before creating a new one
    if "loading_overlay" in globals():
        try:
            loading_overlay.destroy()
        except:
            pass  # Ignore if already removed

    # Grey out the entire screen
    loading_overlay = tk.Canvas(root, width=primary_monitor.width, height=primary_monitor.height, bg="#CECECE")
    loading_overlay.place(x=0, y=0)
    loading_overlay.configure(highlightthickness=0)

    # Create the loading window
    loading_window = tk.Toplevel(root)
    loading_window.title("Processing")
    loading_window.geometry("550x400")  
    loading_window.configure(bg="#DFE5FB")  # Soft blue from your palette
    loading_window.overrideredirect(True)  # Removes title bar for a clean UI

    # Add "Calculating" text
    tk.Label(loading_window, text="Verifying, please wait...", fg="#516A80", bg="#DFE5FB", font=("Arial", 14, "bold")).pack(pady=10)

    # Loading Spinner Animation
    animation_frames = itertools.cycle(["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"])
    loading_label = tk.Label(loading_window, text="⠋", fg="#F8727B", bg="#DFE5FB", font=("Arial", 20))
    loading_label.pack()

    def animate_spinner():
        """Update spinner animation in a loop."""
        loading_label.config(text=next(animation_frames))
        loading_window.after(150, animate_spinner)  # Refresh every 150ms

    animate_spinner()

    # Progress Bar (Fake Progress)
    progress_frame = tk.Frame(loading_window, bg="#DFE5FB")
    progress_frame.pack(pady=10, fill="both", expand=True)

    progress_bar = tk.Canvas(progress_frame, width=250, height=15, bg="#FFFFFF", highlightthickness=0)
    progress_bar.pack()
    
    bar_fill = progress_bar.create_rectangle(0, 0, 0, 15, fill="#516A80", outline="")

    def update_progress(step=0):
        """Animate a fake progress bar filling up."""
        if step > 350:
            return  # Stop when full
        progress_bar.coords(bar_fill, 0, 0, step, 15)
        loading_window.after(50, lambda: update_progress(step + 10))  # Update every 50ms

    update_progress()

    # ✅ Center the success message on the **actual screen**
    root.update_idletasks()  # Ensure the window sizes are updated before getting dimensions

    screen_width = root.winfo_screenwidth()  # Get full screen width
    screen_height = root.winfo_screenheight()  # Get full screen height

    win_width = 550  # Window width
    win_height = 400  # Window height

    x = (screen_width // 2) - (win_width // 2)  # Center X position
    y = (screen_height // 2) - (win_height // 2)  # Center Y position

    loading_window.geometry(f"{win_width}x{win_height}+{x}+{y}")  # Set centered position


def calculation_complete_screen():
    """Show a stylish success message after calibration threshold is set."""
    global loading_overlay, loading_window  # Ensure global scope

    # ✅ Check if loading overlay exists before modifying
    if "loading_overlay" in globals():
        try:
            loading_overlay.configure(bg="#CECECE")  # Grey out
        except:
            print("⚠️ Warning: loading_overlay no longer exists. Skipping background update.")

    # ✅ Destroy loading screen if it exists
    if "loading_window" in globals():
        try:
            loading_window.destroy()
        except:
            pass  # Ignore if already removed

    # Grey out the entire screen
    loading_overlay = tk.Canvas(root, width=primary_monitor.width, height=primary_monitor.height, bg="#CECECE")
    loading_overlay.place(x=0, y=0)
    loading_overlay.configure(highlightthickness=0)
    
    # ✅ Create success message window
    complete_window = tk.Toplevel(root)  
    complete_window.title("Calibration Set")
    complete_window.geometry("800x620")  
    complete_window.configure(bg="#DFE5FB")  # Soft blue from the palette
    complete_window.overrideredirect(True)  # Remove title bar for clean UI

    # ✅ Add success icon (Checkmark inside a circle)
    checkmark_label = tk.Label(
        complete_window, text="✔", font=("Arial", 50, "bold"), fg="#516A80", bg="#DFE5FB"
    )
    checkmark_label.pack(pady=(20, 5))

    # ✅ Success message
    tk.Label(
        complete_window, text="Calibrated - You are set to go!", 
        fg="#516A80", bg="#DFE5FB", font=("Arial", 14, "bold")
    ).pack()

    tk.Label(
        complete_window, text="Please proceed with your task.", 
        fg="#516A80", bg="#DFE5FB", font=("Arial", 12)
    ).pack(pady=(0, 10))

    # ✅ "OK" Button to close message and remove grey overlay
    def close_complete_window():
        complete_window.destroy()
        if "loading_overlay" in globals():
            try:
                loading_overlay.destroy()
                root.destroy()
            except:
                pass

    ok_button = tk.Button(
        complete_window, text="OK", font=("Arial", 12, "bold"), 
        fg="white", bg="#F8727B", activebackground="#516A80",
        padx=20, pady=5, relief="flat", command=close_complete_window
    )
    ok_button.pack(pady=10)

    # ✅ Center the success message on the **actual screen**
    root.update_idletasks()  # Ensure the window sizes are updated before getting dimensions

    screen_width = root.winfo_screenwidth()  # Get full screen width
    screen_height = root.winfo_screenheight()  # Get full screen height

    win_width = 800  # Window width
    win_height = 620  # Window height

    x = (screen_width // 2) - (win_width // 2)  # Center X position
    y = (screen_height // 2) - (win_height // 2)  # Center Y position

    complete_window.geometry(f"{win_width}x{win_height}+{x}+{y}")  # Set centered position

def show_calibration_failed_screen():
    """Display a calibration failure screen with retry instructions."""

    global calibration_overlay, calibration_window, loading_overlay, loading_window

    # ✅ Check if loading overlay exists before modifying
    if "loading_overlay" in globals():
        try:
            loading_overlay.configure(bg="#CECECE")  # Grey out
        except:
            print("⚠️ Warning: loading_overlay no longer exists. Skipping background update.")

    # ✅ Destroy loading screen if it exists
    if "loading_window" in globals():
        try:
            loading_window.destroy()
        except:
            pass  # Ignore if already removed

    # Grey out the entire screen (overlay)
    calibration_overlay = tk.Canvas(root, width=primary_monitor.width, height=primary_monitor.height, bg="#CECECE")
    calibration_overlay.place(x=0, y=0)
    calibration_overlay.configure(highlightthickness=0)

    # Create the calibration failed popup window
    calibration_window = tk.Toplevel(root)
    calibration_window.title("Calibration Failed")
    calibration_window.geometry("500x300")
    calibration_window.configure(bg="#DFE5FB")  # Soft blue background
    calibration_window.overrideredirect(True)  # Remove title bar for a clean UI

    # Add message text
    tk.Label(calibration_window, text="⚠️ Calibration Failed!", fg="#F8727B", bg="#DFE5FB", 
             font=("Arial", 16, "bold")).pack(pady=10)
    tk.Label(calibration_window, text="We were unable to calibrate your gaze.\nWe will attempt another calibration.",
             fg="#516A80", bg="#DFE5FB", font=("Arial", 12)).pack(pady=5)

    # Add a "Ready?" message
    tk.Label(calibration_window, text="Are you ready to try again?", fg="#516A80", bg="#DFE5FB", 
             font=("Arial", 12, "bold")).pack(pady=20)

    # OK button to remove overlay and retry calibration
    def proceed_with_retry():
        """Remove overlay and retry calibration."""
        calibration_overlay.destroy()
        calibration_window.destroy()
        # TODO: Trigger the calibration retry process here

    ok_button = tk.Button(calibration_window, text="OK", command=proceed_with_retry, font=("Arial", 12, "bold"),
                          bg="#516A80", fg="white", padx=10, pady=5)
    ok_button.pack(pady=20)

    # ✅ Center the popup window on the screen
    root.update_idletasks()
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    win_width = 500
    win_height = 300
    x = (screen_width // 2) - (win_width // 2)
    y = (screen_height // 2) - (win_height // 2)
    calibration_window.geometry(f"{win_width}x{win_height}+{x}+{y}")

def show_max_attempts_screen():
    """Display a final error screen when max calibration attempts are reached."""

    global max_attempts_overlay, max_attempts_window, loading_overlay, loading_window

    # ✅ Check if loading overlay exists before modifying
    if "loading_overlay" in globals():
        try:
            loading_overlay.configure(bg="#CECECE")  # Grey out
        except:
            print("⚠️ Warning: loading_overlay no longer exists. Skipping background update.")

    # ✅ Destroy loading screen if it exists
    if "loading_window" in globals():
        try:
            loading_window.destroy()
        except:
            pass  # Ignore if already removed

    # Grey out the entire screen (overlay)
    max_attempts_overlay = tk.Canvas(root, width=primary_monitor.width, height=primary_monitor.height, bg="#CECECE")
    max_attempts_overlay.place(x=0, y=0)
    max_attempts_overlay.configure(highlightthickness=0)

    # Create the final error popup window
    max_attempts_window = tk.Toplevel(root)
    max_attempts_window.title("Calibration Failed - Max Attempts")
    max_attempts_window.geometry("550x350")
    max_attempts_window.configure(bg="#DFE5FB")  # Soft blue background
    max_attempts_window.overrideredirect(True)  # Remove title bar for a clean UI

    # Error message
    tk.Label(max_attempts_window, text="⚠️ Oops! We've hit the max calibration attempts.", fg="#F8727B", bg="#DFE5FB",
             font=("Arial", 16, "bold")).pack(pady=10)
    tk.Label(max_attempts_window, text="It looks like we're having trouble tracking your gaze accurately.\n"
             "This could be due to lighting, screen positioning, or unexpected movement.", fg="#516A80", bg="#DFE5FB",
             font=("Arial", 12), justify="center", wraplength=500).pack(pady=10)
    
    tk.Label(max_attempts_window, text="Try restarting the module to reset the tracking and improve accuracy.",
             fg="#516A80", bg="#DFE5FB", font=("Arial", 12, "bold")).pack(pady=20)

    # OK button to terminate the program
    def exit_program():
        """Destroy everything and exit the program."""
        max_attempts_overlay.destroy()
        max_attempts_window.destroy()
        root.destroy()

    ok_button = tk.Button(max_attempts_window, text="OK", command=exit_program, font=("Arial", 12, "bold"),
                          bg="#516A80", fg="white", padx=10, pady=5)
    ok_button.pack(pady=20)

    # ✅ Center the popup window on the screen
    root.update_idletasks()
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    win_width = 1000
    win_height = 600
    x = (screen_width // 2) - (win_width // 2)
    y = (screen_height // 2) - (win_height // 2)
    max_attempts_window.geometry(f"{win_width}x{win_height}+{x}+{y}")

def reset_collection():
    """Reset all collected data and restart the point collection."""
    global attempts, calibration_x, calibration_y
    global current_point_index, grid_points, overlay, dot, shadow
    
    # Remove all existing dots before starting fresh
    canvas.delete(dot) 
    canvas.delete(shadow)
    
    if "loading_window" in globals():
        try:
            loading_window.destroy()
        except:
            pass  # Ignore if already removed
    
    if "loading_overlay" in globals():
        try:
            loading_overlay.destroy()
        except:
            pass  # Ignore if already removed

    print(f"🔄 Resetting collection and retrying (Attempt {attempts + 1}/{max_attempts + 1})...")

    # Reset calibration flags
    calibration_x = False
    calibration_y = False

    # Reset all data for each grid point
    for key in grid_points.keys():
        grid_points[key]["vector_x"] = []
        grid_points[key]["vector_y"] = []
        grid_points[key]["vector_z"] = []
        grid_points[key]["gaze_pitch"] = []
        grid_points[key]["gaze_yaw"] = []
        grid_points[key]["roll"] = []
        grid_points[key]["pitch"] = []
        grid_points[key]["yaw"] = []
        grid_points[key]["distance"] = []
        grid_points[key]["total_frames"] = 0

    # Reset tracking variables
    current_point_index = 0

    # Restart point selection process
    fade_out(dot, shadow, steps=10, delay=100)
    enable_canvas(overlay)

def check_calibration():
    """Check if calibration succeeded, retry if needed."""
    global attempts, calibration_x, calibration_y

    if (not calibration_x or not calibration_y) and attempts <= max_attempts:
        print(f"🚀 Running Calibration (Attempt {attempts + 1}/{max_attempts + 1})...")

        create_and_train_model()  # Run calibration

        # If calibration failed, retry
        if (not calibration_x or not calibration_y) and attempts < max_attempts:
            show_calibration_failed_screen()
            attempts += 1
            root.after(5000, reset_collection)  # Reset and restart
        elif attempts >= max_attempts: 
            print("🛑 Max attempts reached! We are experiencing technical difficulties. Try restarting the module")
            show_max_attempts_screen()
        else: 
            print("🎉 Gaze calibration Successful!")
            root.after(10000, lambda: calculation_complete_screen())
        
            
def create_and_train_model():
    """Calculate thresholds and remove loading screen"""
    global loading_window, loading_overlay, calibration_x, calibration_y, attempts, current_point_index
    
    # 🔹 Load Data
    test_df = pd.read_csv("gaze_calibration_collection_unseen.csv")
    train_df = pd.read_csv("gaze_calibration_collection_train.csv")

    # Drop unwanted columns
    train_df.drop(['Key'], axis=1, inplace=True)
    test_df.drop(['Key'], axis=1, inplace=True)

    # 🚀 Train X Model
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
        n_jobs=-1,  # Utilize all CPU cores
        use_gpu=False,
        log_experiment=False
    )
    
    catboost_params_x = {
    "depth": 11,
    "l2_leaf_reg": 1,
    "loss_function": 'RMSE',
    "border_count": 254,
    "verbose": True,
    "random_strength": 0.2779865689235258,
    "task_type": 'CPU',
    "n_estimators": 286,
    "random_state": 123,
    "eta": 0.08778935254362887
    }

    x_model = create_model("catboost", **catboost_params_x)
    predictions_x = predict_model(x_model, data=test_df)

    mae_x = mean_absolute_error(predictions_x["x_position"], predictions_x["prediction_label"])

    if not calibration_x and mae_x <= 576:
        save_model(finalize_model(x_model), "User_x_model")
        calibration_x = True

    # 🚀 Train Y Model
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
        normalize_method="robust",  # Based on TransformerWrapper(RobustScaler())
        fold_strategy="kfold",
        fold=10,
        n_jobs=-1,  # Utilize all CPU cores
        use_gpu=False,
        log_experiment=False
    )
    
    y_huber_params = {
    "alpha": 0.0008059676547357147,
    "epsilon": 1.1925311314084526,
    "fit_intercept": True,
    "max_iter": 100,
    "tol": 1e-05,
    "warm_start": False
    }

    y_model = create_model("huber", **y_huber_params)
    predictions_y = predict_model(y_model, data=test_df)

    mae_y = mean_absolute_error(predictions_y["y_position"], predictions_y["prediction_label"])

    if not calibration_y and mae_y <= 330:
        save_model(finalize_model(y_model), "User_y_model")
        calibration_y = True

def check_all_points_clicked():
    """Ensure all points have at least 50 data frames collected."""
    required_keys = ["vector_x","vector_y","vector_z","gaze_pitch", "gaze_yaw", "roll", "pitch", "yaw", "distance"]

    for key, point in grid_points.items():
        for metric in required_keys:
            if len(point.get(metric, [])) < 50:
                print(f"❌ Not enough data for point '{key}', {metric} has {len(point.get(metric, []))} frames.")
                return False  # If any metric has < 50 frames, fail the check

    return True  # If all points have all required data, return True

grid_point_keys = list(grid_points.keys())
current_point_index = 0
  
def show_next_point():
    """Display the next dot on the screen for calibration."""
    global current_point_index, dot, shadow
    
    # Safety check - ensure canvas still exists
    try:
        # Check if canvas still exists by getting its current state
        canvas.winfo_exists()
    except Exception:
        print("Canvas no longer exists, cannot show next point")
        return
        
    if current_point_index >= len(grid_point_keys):
        print("All points processed.")
        return
    
    key = grid_point_keys[current_point_index]
    point = grid_points[key]
    x, y = point["x_position"], point["y_position"]

    # Add debugging output
    print(f"Creating point {key} at position ({x}, {y})")
    
    try:
        # Create shadow and dot for current point
        shadow = canvas.create_oval(x-32, y-28, x+32, y+28, fill="#b3b3b3", outline="")
        dot = canvas.create_oval(x-30, y-30, x+30, y+30, fill="#ff5555", outline="#990000", width=3)
        
        # Debug output to confirm dot and shadow were created
        print(f"Created dot with ID: {dot}, shadow with ID: {shadow}")
        
        # Force update the canvas
        root.update()
        
        # Bind click to only this dot
        canvas.tag_bind(dot, "<Button-1>", lambda event, d=dot, s=shadow: on_click(event, d, s))
        root.update()
        
        # Debug output to confirm we've completed the function
        print("Finished setting up the point")
    except Exception as e:
        print(f"Error creating point: {e}")
        return

def fade_out(dot, shadow, steps=10, delay=100):
    """Gradually fade out a dot and its shadow."""
    # Get the current fill color (assumed to be a hex string, e.g., "#ff5555")
    # For simplicity, hard-code the starting color and target (background) color
    start_color = (255, 85, 85)  # red in RGB
    end_color = (255, 255, 255)  # white
    
    def step(i):
        try:
            # Safety check - ensure canvas still exists
            if not canvas.winfo_exists():
                print("Canvas no longer exists, cannot continue fade out")
                return

            if i > steps:
                canvas.delete(shadow)
                canvas.delete(dot)
                # Optionally, call show_next_point() here if this is the last animation
                show_next_point()
                return
                
            # Compute the intermediate color
            ratio = i / steps
            new_color = tuple(
                int(start_c + (end_c - start_c) * ratio)
                for start_c, end_c in zip(start_color, end_color)
            )
            # Format as hex
            hex_color = "#%02x%02x%02x" % new_color
            canvas.itemconfig(shadow, fill=hex_color)
            canvas.itemconfig(dot, fill=hex_color)
            canvas.after(delay, lambda: step(i + 1))
        except Exception as e:
            print(f"Error during fade out: {e}")
            return
    
    step(0)

# Global flag to control the countdown
countdown_running = True

def start_countdown(item):
    # Place countdown text in the center of the item
    x1, y1, x2, y2 = canvas.coords(item)
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    countdown_text = canvas.create_text(cx, cy, text="0", font=("Arial", 16))

    def update_count(n=0):
        if not countdown_running:
            # Once the flag is False, remove the countdown text
            canvas.delete(countdown_text)
            return
        canvas.itemconfig(countdown_text, text=str(n))
        # Schedule the next update after 1 second
        canvas.after(1000, lambda: update_count(n + 1))

    update_count()
    
def disable_canvas():
    # Option 1: Unbind specific events for the active dot
    canvas.unbind("<Button-1>")
    # Option 2: Or create an overlay that covers the whole canvas
    overlay = canvas.create_rectangle(0, 0, width, height, fill="gray", outline="", stipple="gray50", tags="overlay")
    return overlay

def enable_canvas(overlay):
    canvas.delete(overlay)
    # Rebind the click events to your active dot as needed.
    
show_next_point()   

# Debug UI elements
print(f"Canvas dimensions: {canvas.winfo_width()}x{canvas.winfo_height()}")
print(f"Total points to display: {len(grid_point_keys)}")
print(f"Screen dimensions: {width}x{height}")

# Force an update before mainloop
root.update_idletasks()

# Additional debugging output
print("Starting main loop now - UI should be visible")

root.mainloop()
