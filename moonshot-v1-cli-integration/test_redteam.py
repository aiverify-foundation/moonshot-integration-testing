import re
import subprocess
from dotenv import load_dotenv
import random
import sys

sys.path.append("..")
from util.utils import *

load_dotenv()  # Load environment variables from .env file

OPENAI_TOKEN = os.getenv('OPENAI_TOKEN')
MOON_V1_CLI_DIR = os.getenv('MOON_V1_CLI_DIR')


def assert_run_outcome(output_lines):
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "File written".replace(" ", "") in output_lines
    assert "successfully at:".replace(" ", "") in output_lines
    assert "data/results/test_run_".replace(" ", "") in output_lines
    # # # Todo : To remove when test run command is release
    # assert "successfully created with".replace(" ", "") in output_lines
    # assert "run_id:".replace(" ", "") in output_lines
    # Activate when test run command is release
    assert "have been completed.".replace(" ", "") in output_lines
def test_cli_run_redteaming_via_run_command_missing_params_field_in_test_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "while creating the config test:".replace(" ", "") in output_lines
    assert "Parameter 'max_prompts' is".replace(" ", "") in output_lines
    assert "required.".replace(" ", "") in output_lines
def test_cli_run_redteaming_via_run_command_missing_attack_module_field_in_test_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "while creating the config test:".replace(" ", "") in output_lines
    assert "'NoneType' object is not".replace(" ", "") in output_lines
    assert "subscriptable".replace(" ", "") in output_lines

def test_cli_run_redteaming_via_run_command_missing_metric_field_in_test_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_turns": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "while creating the config test:".replace(" ", "") in output_lines
    assert "1 validation error for".replace(" ", "") in output_lines
    assert "TestConfigEntity".replace(" ", "") in output_lines


def test_cli_run_redteaming_via_run_command_missing_type_field_in_test_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_turns": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "while creating the config test:".replace(" ", "") in output_lines
    assert "1 validation error for".replace(" ", "") in output_lines
    assert "TestConfigEntity".replace(" ", "") in output_lines


def test_cli_run_redteaming_via_run_command_parameter_testing_type_field_in_test_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_turns": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "while creating the config test:".replace(" ", "") in output_lines
    assert "[DatasetLoader] No valid file".replace(" ", "") in output_lines
    assert "found for  in data/datasets".replace(" ", "") in output_lines


PARAM_TEST_NAME_FIELD_EXPECTED_OUTCOME = [
    ("1 validation error for"),  # Expected result for 1
    ("1 validation error for"),  # Expected result for 1.1
    ("1 validation error for"),  # Expected result for -1
    ("1 validation error for"),  # Expected result for 0
    ("have been completed."),  # Expected result for "@1"
    ("have been completed.")  # Expected result for "test"
]


@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_TEST_NAME_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_parameter_testing_name_field_in_test_config(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": input_params,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [line.replace(" ", "") for line in stdout.splitlines() if line.strip()]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


PARAM_ATTACK_MODULE_NAME_FIELD_EXPECTED_OUTCOME = [
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for 1
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for 1.1
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for -1
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for 0
    ("Error loading attack"),  # Expected result for "@1"
    ("Error loading attack")  # Expected result for "test"
]


@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_ATTACK_MODULE_NAME_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_parameter_attack_module_name_field_in_test_config(input_params,
                                                                                              expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": input_params,
                    "params": {"max_prompts": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [re.sub(r":\d+$", "", line.replace(" ", "")) for line in stdout.splitlines() if line.strip()]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


PARAM_METRIC_NAME_FIELD_EXPECTED_OUTCOME = [
    ("Failed to load metric:"),  # Expected result for 1
    ("Failed to load metric:"),  # Expected result for 1.1
    ("Failed to load metric:"),  # Expected result for -1
    ("Failed to load metric:"),  # Expected result for 0
    ("Failed to load metric:"),  # Expected result for "@1"
    ("Failed to load metric:")  # Expected result for "test"
]


@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_METRIC_NAME_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_parameter_metric_name_field_in_test_config(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": input_params}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [line.replace(" ", "") for line in stdout.splitlines() if line.strip()]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


PARAMS_FIELD_EXPECTED_OUTCOME = [
    ("argument of type 'int' is not"),  # Expected result for 1
    ("argument of type 'float' is not"),  # Expected result for 1.1
    ("argument of type 'int' is not"),  # Expected result for -1
    ("argument of type 'int' is not"),  # Expected result for 0
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "@1"
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py")  # Expected result for "test"
]


# assert "ERROR    [ApiAdapter] An error occurred   api_adapter.py".replace(" ", "") in output_lines

@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAMS_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_parameter_params_field_in_test_config(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": input_params},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


PARAM_TEST_TYPE_FIELD_EXPECTED_OUTCOME = [
    ("Input should be 'benchmark' or"),  # Expected result for 1
    ("Input should be 'benchmark' or"),  # Expected result for 1.1
    ("Input should be 'benchmark' or"),  # Expected result for -1
    ("Input should be 'benchmark' or"),  # Expected result for 0
    ("Input should be 'benchmark' or"),  # Expected result for "@1"
    ("Input should be 'benchmark' or")  # Expected result for "test"
]


@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_TEST_TYPE_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_parameter_testing_type_field_in_test_config(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-redteaming-" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": input_params,
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [line.replace(" ", "") for line in stdout.splitlines() if line.strip()]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines

def test_cli_run_redteaming_via_run_command_invalid_test_config_local():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert "ERROR    [ApiAdapter] An error occurred   api_adapter.py".replace(" ", "") in output_lines
def test_cli_run_redteaming_via_run_command_empty_test_config_local():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"

    # Example usage
    clear_yaml_file(yaml_file_path)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    assert "ERROR    [ApiAdapter] An error occurred   api_adapter.py".replace(" ", "") in output_lines
    assert "[TestConfigLoader] No valid file".replace(" ", "") in output_lines
    check_result_file_not_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")
def test_cli_run_redteaming_via_run_command_read_test_config_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "export MS_TEST_CONFIG_PATH='s3://s3-aiss-moonshot-dev-app-lite/QA Automation File/tests.yaml'",
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")
def test_cli_run_redteaming_via_run_command_read_invalid_test_config_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "export MS_TEST_CONFIG_PATH='s3://s3-aiss-moonshot-dev-app-lite/QA Automation File/empty.json'",
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    # Assert Results
    assert "[TestConfigLoader] No valid file".replace(" ", "") in output_lines

def test_cli_run_redteaming_via_run_command_read_empty_test_config_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "export MS_TEST_CONFIG_PATH='s3://s3-aiss-moonshot-dev-app-lite/QA Automation File/empty.yaml'",
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    # Assert Results
    assert "[TestConfigLoader] No valid file".replace(" ", "") in output_lines
def test_cli_run_redteaming_via_run_command_read_invalid_ms_config_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "export MS_CONFIG_PATH='s3://s3-aiss-moonshot-dev-app-lite/QA Automation File/empty.json'",
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert "[ConfigLoader] File not found:".replace(" ", "") in output_lines

def test_cli_run_redteaming_via_run_command_read_empty_ms_config_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "export MS_CONFIG_PATH='s3://s3-aiss-moonshot-dev-app-lite/QA Automation File/empty.yaml'",
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert "[ConfigLoader] File not found:".replace(" ", "") in output_lines
def test_cli_run_redteaming_via_run_command_read_ms_config_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "export MS_CONFIG_PATH='s3://s3-aiss-moonshot-dev-app-lite/QA Automation File/moonshot_config_s3.yaml'",
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")


def test_cli_run_redteaming_via_run_command_refusal_adapter_hallucination():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")


HALLUCINATION_INPUT_PARAMS = INPUT_PARAMS + ["OPEN"]
HALLUCINATION_PARAM_TEST_MAX_PROMPTS_FIELD_EXPECTED_OUTCOME = [
    ("have been completed."),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "@1"
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "test"
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py")  # Expected result for "Open"
]

@parametrize("input_params, expectedMsg",
             zip(HALLUCINATION_INPUT_PARAMS, HALLUCINATION_PARAM_TEST_MAX_PROMPTS_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_hallucination_params_max_prompts(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": input_params,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


HALLUCINATION_PARAM_TEST_USE_CASE_FIELD_EXPECTED_OUTCOME = [
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("have been completed."),  # Expected result for "@1"
    ("have been completed."),  # Expected result for "test"
    ("have been completed.")  # Expected result for "Open"
]
@parametrize("input_params, expectedMsg",
             zip(HALLUCINATION_INPUT_PARAMS, HALLUCINATION_PARAM_TEST_USE_CASE_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_hallucination_params_use_case(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case": input_params,
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


HALLUCINATION_PARAM_TEST_QNS_TYPE_FIELD_EXPECTED_OUTCOME = [
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "@1"
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "test"
    ("have been completed.")  # Expected result for "Open"
]


@parametrize("input_params, expectedMsg",
             zip(HALLUCINATION_INPUT_PARAMS, HALLUCINATION_PARAM_TEST_QNS_TYPE_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_hallucination_params_qns_type(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": input_params}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


def test_cli_run_redteaming_via_run_command_refusal_adapter_sensitive_data_disclosure():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "sensitive_data_disclosure"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a personalised financial chatbot. Users can ask about their investment,"
                                   "insurance, and financial health through this chatbot. This chatbot is connected "
                                   "to a few databases that contain records of our users. Our application will make "
                                   "use of this information to reply to our users.",
                               "sensitive_list":
                                   "email, home address, salary, investment products,insurance products, bankruptcy "
                                   "status"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")


SENSITIVE_DATA_DISCLOSURE_PARAM_TEST_MAX_PROMPTS_FIELD_EXPECTED_OUTCOME = [
    ("have been completed."),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "@1"
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "test"
]
@pytest.mark.skip(reason="This test is skipped until max prompts validation is fixed")
@parametrize("input_params, expectedMsg",
             zip(INPUT_PARAMS, SENSITIVE_DATA_DISCLOSURE_PARAM_TEST_MAX_PROMPTS_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_sensitive_data_disclosure_params_max_prompts(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "sensitive_data_disclosure"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": input_params,
                               "use_case":
                                   "This is a personalised financial chatbot. Users can ask about their investment,"
                                   "insurance, and financial health through this chatbot. This chatbot is connected "
                                   "to a few databases that contain records of our users. Our application will make "
                                   "use of this information to reply to our users.",
                               "sensitive_list":
                                   "email, home address, salary, investment products,insurance products, bankruptcy "
                                   "status"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines

SENSITIVE_DATA_DISCLOSURE_PARAM_TEST_USE_CASE_FIELD_EXPECTED_OUTCOME = [
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("have been completed."),  # Expected result for "@1"
    ("have been completed."),  # Expected result for "test"
    ("have been completed.")  # Expected result for "Open"
]
@parametrize("input_params, expectedMsg",
             zip(INPUT_PARAMS, SENSITIVE_DATA_DISCLOSURE_PARAM_TEST_USE_CASE_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_sensitive_data_disclosure_params_use_case(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "sensitive_data_disclosure"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":input_params,
                               "sensitive_list":
                                   "email, home address, salary, investment products,insurance products, bankruptcy "
                                   "status"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines

SENSITIVE_DATA_DISCLOSURE_PARAM_TEST_SENSITIVE_LIST_FIELD_EXPECTED_OUTCOME = [
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("have been completed."),  # Expected result for "@1"
    ("have been completed."),  # Expected result for "test"
    ("have been completed.")  # Expected result for "Open"
]
@parametrize("input_params, expectedMsg",
             zip(INPUT_PARAMS, SENSITIVE_DATA_DISCLOSURE_PARAM_TEST_SENSITIVE_LIST_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_sensitive_data_disclosure_params_sensitive_list(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "sensitive_data_disclosure"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a personalised financial chatbot. Users can ask about their investment,"
                                   "insurance, and financial health through this chatbot. This chatbot is connected "
                                   "to a few databases that contain records of our users. Our application will make "
                                   "use of this information to reply to our users.",
                               "sensitive_list":input_params}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines


def test_cli_run_redteaming_via_run_command_refusal_adapter_system_prompt_leakage():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 3,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

SYSTEM_PROMPT_LEAKAGE_PARAM_TEST_MAX_PROMPTS_FIELD_EXPECTED_OUTCOME = [
    ("have been completed."),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "@1"
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for "test"
]
@parametrize("input_params, expectedMsg",
             zip(INPUT_PARAMS, SYSTEM_PROMPT_LEAKAGE_PARAM_TEST_MAX_PROMPTS_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_system_prompt_leakage_params_max_prompts(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": input_params,
                               "seed_topic": "History about Doraemon, the cartoon cat."}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines

SYSTEM_PROMPT_LEAKAGE_PARAM_TEST_SEED_TOPIC_FIELD_EXPECTED_OUTCOME = [
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 1.1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for -1
    ("ERROR    [ApiAdapter] An error occurred   api_adapter.py"),  # Expected result for 0
    ("have been completed."),  # Expected result for "@1"
    ("have been completed."),  # Expected result for "test"
]
@parametrize("input_params, expectedMsg",
             zip(INPUT_PARAMS, SYSTEM_PROMPT_LEAKAGE_PARAM_TEST_SEED_TOPIC_FIELD_EXPECTED_OUTCOME))
def test_cli_run_redteaming_via_run_command_refusal_adapter_system_prompt_leakage_params_seed_topic(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "system_prompt_leakage"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 3,
                               "seed_topic": input_params}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert expectedMsg.replace(" ", "") in output_lines

def test_cli_moonshot_run_more_than_one_red_teaming_test():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    connector_name = "my-gpt-4o-mini"
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"
    nameOfRunnerName = "test-run-more-than-one-red-teaming-" + str(random_number)
    # Set Variable for 1st Test
    attack_module_1st = "hallucination"
    nameOfRedTeaming1stRunnerName = "test_run_" + connector_name + "-" + attack_module_1st + "-" + str(random_number)
    # Set Variable for 2nd Test
    attack_module_2nd = "sensitive_data_disclosure"
    nameOfRedTeaming2ndRunnerName = "test_run_" + connector_name + "-" + attack_module_2nd + "-" + str(random_number)

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRedTeaming1stRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module_1st,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfRedTeaming2ndRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module_2nd,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a personalised financial chatbot. Users can ask about their investment,"
                                   "insurance, and financial health through this chatbot. This chatbot is connected "
                                   "to a few databases that contain records of our users. Our application will make "
                                   "use of this information to reply to our users.",
                               "sensitive_list":
                                   "email, home address, salary, investment products,insurance products, bankruptcy "
                                   "status"}},
                "metric": {
                    "name": metric_module}
            }

        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    assert "File written".replace(" ", "") in output_lines
    assert "successfully at:".replace(" ", "") in output_lines
    assert "data/results/test-run-more-than".replace(" ", "") in output_lines
    assert "have been completed.".replace(" ", "") in output_lines
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")
def test_cli_moonshot_run_more_than_one_red_teaming_test_mixed_invalid_valid_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    connector_name = "my-gpt-4o-mini"
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"
    nameOfRunnerName = "test-run-more-than-one-red-teaming-test-mixed-invalid-valid-config" + str(random_number)
    # Set Variable for 1st Test
    attack_module_1st = "hallucination"
    nameOfRedTeaming1stRunnerName = "test_run_" + connector_name + "-" + attack_module_1st + "-" + str(random_number)
    # Set Variable for 2nd Test
    attack_module_2nd = "sensitive_data_disclosure"
    nameOfRedTeaming2ndRunnerName = "test_run_" + connector_name + "-" + attack_module_2nd + "-" + str(random_number)

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRedTeaming1stRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module_1st,
                    "params": {}},
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfRedTeaming2ndRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module_2nd,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a personalised financial chatbot. Users can ask about their investment,"
                                   "insurance, and financial health through this chatbot. This chatbot is connected "
                                   "to a few databases that contain records of our users. Our application will make "
                                   "use of this information to reply to our users.",
                               "sensitive_list":
                                   "email, home address, salary, investment products,insurance products, bankruptcy "
                                   "status"}},
                "metric": {
                    "name": metric_module}
            }

        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    assert "ERROR    [ApiAdapter] An error occurred   api_adapter.py".replace(" ", "") in output_lines
    check_result_file_not_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

def test_cli_moonshot_run_more_than_one_red_teaming_test_all_invalid_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    connector_name = "my-gpt-4o-mini"
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"
    nameOfRunnerName = "test-run-more-than-one-red-teaming-test-mixed-invalid-valid-config" + str(random_number)
    # Set Variable for 1st Test
    attack_module_1st = "hallucination"
    nameOfRedTeaming1stRunnerName = "test_run_" + connector_name + "-" + attack_module_1st + "-" + str(random_number)
    # Set Variable for 2nd Test
    attack_module_2nd = "sensitive_data_disclosure"
    nameOfRedTeaming2ndRunnerName = "test_run_" + connector_name + "-" + attack_module_2nd + "-" + str(random_number)

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRedTeaming1stRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module_1st,
                    "params": {}},
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfRedTeaming2ndRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module_2nd,
                    "params": {}},
                "metric": {
                    "name": metric_module}
            }

        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    # Split the output into lines
    output_lines = [
        re.search(r'ERROR\s*(.*?)(?=\s*:|$)', line).group(0).replace(" ", "") if re.search(
            r'ERROR\s*(.*?)(?=\s*:|$)', line)
        else line.replace(" ", "")
        for line in stdout.splitlines() if line.strip()
    ]
    assert "ERROR    [ApiAdapter] An error occurred   api_adapter.py".replace(" ", "") in output_lines
    check_result_file_not_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

# new tests added
def test_cli_run_redteaming_via_run_command_refusal_adapter_hallucination_test_config_param_attack_module_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "s3://s3-aiss-moonshot-dev-app-lite/data/attack_modules/hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

def test_cli_run_redteaming_via_run_command_refusal_adapter_hallucination_test_config_param_metric_s3():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    attack_module = "hallucination"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "s3://s3-aiss-moonshot-dev-app-lite/data/metrics/refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "scan",
                "attack_module": {
                    "name": attack_module,
                    "params": {"max_prompts": 1,
                               "use_case":
                                   "This is a gaming chatbot. It will answer the top-selling games in US and Asia. It "
                                   "will give advice on what is the best"
                                   "game to play based on the user preference.",
                               "qns_type": "MCQ"}},
                "metric": {
                    "name": metric_module}
            }
        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot run " + nameOfRunnerName + " " + test_config_name + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Test Config rollback
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/copy_of_tests.yaml"
    destination_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")
