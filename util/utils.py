import os
import shutil
import pytest
import yaml

def copy_and_move_file(source_path, destination_path):
    """
    Copies and moves a file to the specified destination.
    If the file already exists at the destination, it replaces it.

    :param source_path: Path to the source file.
    :param destination_path: Path to the destination file.
    """
    try:
        # Ensure the source file exists
        if not os.path.isfile(source_path):
            print(f"Error: Source file '{source_path}' does not exist.")
            return

        # Ensure the destination directory exists; create if necessary
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)

        # Copy the file to the destination (overwrites if exists)
        shutil.copy2(source_path, destination_path)
        print(f"File copied to '{destination_path}' successfully.")

        # Move the file to the destination (replace if it already exists)
        shutil.move(source_path, destination_path)
        print(f"File moved to '{destination_path}' successfully.")
    except Exception as e:
        print(f"Error: {e}")
def copy_file(file_path):
    # Get the file name and directory path
    directory, filename = os.path.split(file_path)

    # Create a new file name by appending "_copy" to the original file name
    new_filename = f"copy_of_{filename}"

    # Create the full path for the new file
    new_file_path = os.path.join(directory, new_filename)

    # Copy the file to the new location
    shutil.copy(file_path, new_file_path)

    print(f"File copied to: {new_file_path}")
def rename_file(current_path, new_name):
    # Get the directory path from the current file path
    directory = os.path.dirname(current_path)

    # Create the new file path with the new name
    new_file_path = os.path.join(directory, new_name)

    # Rename the file
    os.rename(current_path, new_file_path)

    print(f"File renamed to: {new_file_path}")
    return new_file_path  # Optionally return the new file path

def replace_file_content(file_path, new_content):
    """
    Replaces the content of a file with the provided new content.

    Args:
        file_path (str): Path to the file to be modified.
        new_content (str): The new content to write to the file.

    Returns:
        None
    """
    try:
        with open(file_path, 'w') as file:
            file.write(new_content)
        print(f"Successfully replaced the content of {file_path}.")
    except FileNotFoundError:
        print(f"Error: The file {file_path} does not exist.")
    except IOError as e:
        print(f"Error writing to file {file_path}: {e}")

def parametrize(*args, **kwargs):
    """A utility wrapper for pytest's parametrize."""
    return pytest.mark.parametrize(*args, **kwargs)

# Predefined parameter sets for reuse
INPUT_PARAMS = [
    1,
    1.1,
    -1,
    0,
    "@1",
    "test"
]
def check_result_file_exists(filepath):
    assert os.path.isfile(filepath), f"Error: File '{filepath}' does not exist."


def check_result_file_not_exists(filepath):
    """
    Asserts that the given file does not exist.

    :param filepath: Path to the file to check.
    :raises AssertionError: If the file exists.
    """
    assert not os.path.isfile(filepath), f"Error: File '{filepath}' already exists."

def modify_yaml(file_path, updates):
    """
    Modify YAML content based on the given updates.
    :param file_path: Path to the YAML file.
    :param updates: Dictionary containing the keys to be updated with new values.
    """
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)

    # Apply updates
    for key, value in updates.items():
        if key in data:
            data[key] = value

    with open(file_path, 'w') as file:
        yaml.dump(data, file, default_flow_style=False)


def replace_yaml_content(file_path, new_data):
    """
    Replaces the entire content of a YAML file with new data.

    :param file_path: Path to the YAML file
    :param new_data: New data to replace the entire YAML content
    """
    with open(file_path, 'w') as file:
        yaml.safe_dump(new_data, file, default_flow_style=False)  # Write new content
