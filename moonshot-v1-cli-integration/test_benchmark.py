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
    assert "data/results/my-benchm".replace(" ", "") in output_lines
    # # Todo : To remove when test run command is release
    # assert "successfully created with".replace(" ", "") in output_lines
    # Activate when test run command is release
    assert "have been completed. Successfully".replace(" ", "") in output_lines


EXPECTED_OUTCOME = [
    ("No valid file found for 1 in "),  # Expected result for 1
    ("No valid file found for 1.1 in"),  # Expected result for 1.1
    (""),  # Expected result for -1
    ("No valid file found for 0 in"),  # Expected result for 0
    ("No valid file found for @1 in"),  # Expected result for "@1"
    ("No valid file found for test in")  # Expected result for "test"
]
@pytest.mark.skip(reason="This test is skipped for as command is removed")
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, EXPECTED_OUTCOME))
def test_cli_run_benchmarking_params_testing_dataset_module(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = str(input_params)
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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
    # Assert Outcome
    if input_params == -1:
        # Assert that the subprocess failed
        assert process.returncode != 0  # Ensure it exits with an error
        # Assert that the error contains Pydantic's validation message
        assert "Error: No such option: -1\n"
    else:
        assert expectedMsg.replace(" ", "") in output_lines


CONNECTOR_EXPECTED_OUTCOME = [
    ("ERROR    [TaskManager] Error loading the task_manager.py:485"),  # Expected result for 1
    ("ERROR    [TaskManager] Error loading the task_manager.py:485"),  # Expected result for 1.1
    (""),  # Expected result for -1
    ("ERROR    [TaskManager] Error loading the task_manager.py:485"),  # Expected result for 0
    ("ERROR    [TaskManager] Error loading the task_manager.py:485"),  # Expected result for "@1"
    ("ERROR    [TaskManager] Error loading the task_manager.py:485")  # Expected result for "test"
]
@pytest.mark.skip(reason="This test is skipped for as command is removed")
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, CONNECTOR_EXPECTED_OUTCOME))
def test_cli_run_benchmarking_params_testing_connector_name(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_payload_splitting"
    connector_name = str(input_params)
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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
    # Assert Outcome
    if input_params == -1:
        # Assert that the subprocess failed
        assert process.returncode != 0  # Ensure it exits with an error
        # Assert that the error contains Pydantic's validation message
        assert "Error: No such option: -1\n"
    else:
        assert expectedMsg.replace(" ", "") in output_lines


METRIC_MODULE_EXPECTED_OUTCOME = [
    ("Error loading metric"),  # Expected result for 1
    ("Error loading metric"),  # Expected result for 1.1
    (""),  # Expected result for -1
    ("Error loading metric"),  # Expected result for 0
    ("Error loading metric"),  # Expected result for "@1"
    ("Error loading metric")  # Expected result for "test"
]
@pytest.mark.skip(reason="This test is skipped for as command is removed")
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, METRIC_MODULE_EXPECTED_OUTCOME))
def test_cli_run_benchmarking_params_testing_metric_module(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_payload_splitting"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = str(input_params)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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
    # Assert Outcome
    if input_params == -1:
        # Assert that the subprocess failed
        assert process.returncode != 0  # Ensure it exits with an error
        # Assert that the error contains Pydantic's validation message
        assert "Error: No such option: -1\n"
    else:
        assert expectedMsg.replace(" ", "") in output_lines

@pytest.mark.skip(reason="This test is skipped for as command is removed")
def test_cli_run_benchmarking_refusal_adapter_prompt_injection_obfuscation():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_obfuscation"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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

@pytest.mark.skip(reason="This test is skipped for as command is removed")
def test_cli_run_benchmarking_refusal_adapter_prompt_injection_payload_splitting():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_payload_splitting"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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

@pytest.mark.skip(reason="This test is skipped for as command is removed")
def test_cli_run_benchmarking_refusal_adapter_prompt_injection_role_playing():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_role_playing"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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

@pytest.mark.skip(reason="This test is skipped for as command is removed")
def test_cli_run_benchmarking_refusal_adapter_sensitive_data_disclosure_general():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/sensitive_data_disclosure_general"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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

@pytest.mark.skip(reason="This test is skipped for as command is removed")
def test_cli_run_benchmarking_refusal_adapter_prompt_injection_jailbreak():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_jailbreak"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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

def test_cli_run_benchmarking_via_run_command_refusal_adapter_prompt_injection_jailbreak_read_dataset_local():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "prompt_injection_jailbreak"
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = "refusal_adapter"

    # Mini Dataset prep for testing
    # Duplicate file to revert later
    source_path = "./test_data/prompt_injection_jailbreak.json"
    copy_file(source_path)
    source_path = MOON_V1_CLI_DIR + "/data/datasets/prompt_injection_jailbreak.json"
    copy_file(source_path)

    source_path = "./test_data/copy_of_prompt_injection_jailbreak.json"
    destination_path = MOON_V1_CLI_DIR + "/data/datasets/prompt_injection_jailbreak.json"
    copy_and_move_file(source_path, destination_path)


    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
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
    # Test Data rollback
    source_path = MOON_V1_CLI_DIR + "/data/datasets/copy_of_prompt_injection_jailbreak.json"
    destination_path = MOON_V1_CLI_DIR + "/data/datasets/prompt_injection_jailbreak.json"
    copy_and_move_file(source_path, destination_path)

    # Assert Results
    assert_run_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")
def test_cli_run_benchmarking_via_run_command_refusal_adapter_prompt_injection_jailbreak():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_jailbreak"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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



def test_cli_run_benchmarking_via_run_command_refusal_adapter_sensitive_data_disclosure_general():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/sensitive_data_disclosure_general"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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



def test_cli_run_benchmarking_via_run_command_refusal_adapter_prompt_injection_role_playing():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_role_playing"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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



def test_cli_run_benchmarking_via_run_command_refusal_adapter_prompt_injection_payload_splitting():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_payload_splitting"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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


def test_cli_run_benchmarking_via_run_command_refusal_adapter_prompt_injection_obfuscation():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_obfuscation"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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


@pytest.mark.skip(reason="Trial testing")
def test_cli_run_benchmarking_modified_default_yaml():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_payload_splitting"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    yaml_file_path = MOON_V1_CLI_DIR + "/moonshot_config.yaml"
    updates = {

    }
    modify_yaml(yaml_file_path, updates)

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
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


RUN_ID_EXPECTED_OUTCOME = [
    ("have been completed. Successfully"),  # Expected result for 1
    ("have been completed. Successfully"),  # Expected result for 1.1
    (""),  # Expected result for -1
    ("have been completed. Successfully"),  # Expected result for 0
    ("have been completed. Successfully"),  # Expected result for "@1"
    ("have been completed. Successfully")  # Expected result for "test"
]
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, RUN_ID_EXPECTED_OUTCOME))
def test_cli_moonshot_run_params_testing_run_id(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_jailbreak"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = str(input_params)
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
                "type": "benchmark",
                "dataset": dataset_module,
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

    # Assert Outcome
    if input_params == -1:
        # Assert that the subprocess failed
        assert process.returncode != 0  # Ensure it exits with an error
        # Assert that the error contains Pydantic's validation message
        assert "Error: No such option: -1\n"
    else:
        assert expectedMsg.replace(" ", "") in output_lines


PARAM_CONNECTOR_EXPECTED_OUTCOME = [
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for 1
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for 1.1
    (""),  # Expected result for -1
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for 0
    ("ERROR    [TaskManager] Error loading the task_manager.py"),  # Expected result for "@1"
    ("ERROR    [TaskManager] Error loading the task_manager.py")  # Expected result for "test"
]
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_CONNECTOR_EXPECTED_OUTCOME))
def test_cli_moonshot_run_params_testing_connector_name(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_jailbreak"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = str(input_params)
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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

    # Assert Outcome
    if input_params == -1:
        # Assert that the subprocess failed
        assert process.returncode != 0  # Ensure it exits with an error
        # Assert that the error contains Pydantic's validation message
        assert "Error: No such option: -1\n"
    else:
        assert expectedMsg.replace(" ", "") in output_lines


TEST_CONFIG_ID_EXPECTED_OUTCOME = [
    ("while creating the config test:"),  # Expected result for 1
    ("while creating the config test:"),  # Expected result for 1.1
    (""),  # Expected result for -1
    ("while creating the config test:"),  # Expected result for 0
    ("while creating the config test:"),  # Expected result for "@1"
    ("while creating the config test:")  # Expected result for "test"
]
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, TEST_CONFIG_ID_EXPECTED_OUTCOME))
def test_cli_moonshot_run_params_testing_test_config_id(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_jailbreak"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
    test_config_name = str(input_params)
    metric_module = "refusal_adapter"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        "qa_test": [
            {
                "name": nameOfRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
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

    # Assert Outcome
    if input_params == -1:
        # Assert that the subprocess failed
        assert process.returncode != 0  # Ensure it exits with an error
        # Assert that the error contains Pydantic's validation message
        assert "Error: No such option: -1\n"
    else:
        assert expectedMsg.replace(" ", "") in output_lines


PARAM_DATASET_FIELD_EXPECTED_OUTCOME = [
    ("[DatasetLoader] No valid file"),  # Expected result for 1
    ("[DatasetLoader] No valid file"),  # Expected result for 1.1
    ("[DatasetLoader] No valid file"),  # Expected result for -1
    ("[DatasetLoader] No valid file"),  # Expected result for 0
    ("[DatasetLoader] No valid file"),  # Expected result for "@1"
    ("[DatasetLoader] No valid file")  # Expected result for "test"
]
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_DATASET_FIELD_EXPECTED_OUTCOME))
def test_cli_run_benchmarking_via_run_command_parameter_dataset_type_field_in_test_config(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = str(input_params)
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
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
                "type": "benchmark",
                "dataset": dataset_module,
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

PARAM_METRIC_NAME_FIELD_EXPECTED_OUTCOME = [
    ("Error loading metric"),  # Expected result for 1
    ("Error loading metric"),  # Expected result for 1.1
    ("Error loading metric"),  # Expected result for -1
    ("Error loading metric"),  # Expected result for 0
    ("Error loading metric"),  # Expected result for "@1"
    ("Error loading metric")  # Expected result for "test"
]
@parametrize("input_params, expectedMsg", zip(INPUT_PARAMS, PARAM_METRIC_NAME_FIELD_EXPECTED_OUTCOME))
def test_cli_run_benchmarking_via_run_command_parameter_metric_name_field_in_test_config(input_params, expectedMsg):
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_jailbreak"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
    test_config_name = "qa-tests"
    metric_module = str(input_params)

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
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


def test_cli_moonshot_run_red_teaming_and_benchmarking_test():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_obfuscation"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    attack_module = "hallucination"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    connector_name = "my-gpt-4o-mini"
    nameOfRunnerName = "test-run-benchmarking-redteaming-" + "-" + str(random_number)
    nameOfBenchmarkRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
    nameOfRedTeamingRunnerName = "test_run_" + connector_name + "-" + attack_module + "-" + str(random_number)
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"

    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfBenchmarkRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfRedTeamingRunnerName,
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
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    assert "File written".replace(" ", "") in output_lines
    assert "successfully at:".replace(" ", "") in output_lines
    assert "data/results/test-run-benchmark".replace(" ", "") in output_lines
    assert "have been completed. Successfully".replace(" ", "") in output_lines
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

def test_cli_moonshot_run_more_than_one_benchmarking_test():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    connector_name = "my-gpt-4o-mini"
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"
    nameOfRunnerName = "test-run-more-than-one-benchmarking-" + str(random_number)
    # Set Variable for 1st Test
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_obfuscation"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    nameOfBenchmark1stRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
    # Set Variable for 2nd Test
    dataset_2nd_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_role_playing"
    dataset_2nd_source = "s3-" + dataset_2nd_module[len(prefix):]
    nameOfBenchmark2ndRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_2nd_source + "-" + str(random_number)


    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfBenchmark1stRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfBenchmark2ndRunnerName,
                "type": "benchmark",
                "dataset": dataset_2nd_module,
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
    assert "have been completed. Successfully".replace(" ", "") in output_lines
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")


def test_cli_moonshot_run_more_than_one_benchmarking_test_mixed_invalid_valid_config():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    connector_name = "my-gpt-4o-mini"
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"
    nameOfRunnerName = "test-run-more-than-one-benchmarking-test-mixed-invalid-valid-config-" + str(random_number)
    # Set Variable for 1st Test
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_obfuscation"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    nameOfBenchmark1stRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
    # Set Variable for 2nd Test
    dataset_2nd_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_role_playing"
    dataset_2nd_source = "s3-" + dataset_2nd_module[len(prefix):]
    nameOfBenchmark2ndRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_2nd_source + "-" + str(random_number)


    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfBenchmark1stRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfBenchmark2ndRunnerName,
                "type": "benchmark",
                "dataset": dataset_2nd_module+"_fail",
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

    assert "[DatasetLoader] No valid file".replace(" ", "") in output_lines
    assert "found for".replace(" ", "") in output_lines
    check_result_file_not_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

def test_cli_moonshot_run_more_than_one_benchmarking_test_with_invalid_token():
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    connector_name = "my-gpt-4o-mini"
    metric_module = "refusal_adapter"
    test_config_name = "qa-tests"
    nameOfRunnerName = "test-run-more-than-one-benchmarking-test-with-invalid-token-" + str(random_number)
    # Set Variable for 1st Test
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_obfuscation"
    prefix = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/"
    dataset_source = "s3-" + dataset_module[len(prefix):]
    nameOfBenchmark1stRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_source + "-" + str(random_number)
    # Set Variable for 2nd Test
    dataset_2nd_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_role_playing"
    dataset_2nd_source = "s3-" + dataset_2nd_module[len(prefix):]
    nameOfBenchmark2ndRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_2nd_source + "-" + str(random_number)


    # Test Config modification
    source_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    copy_file(source_path)
    yaml_file_path = MOON_V1_CLI_DIR + "/data/test_configs/tests.yaml"
    updates = {
        test_config_name: [
            {
                "name": nameOfBenchmark1stRunnerName,
                "type": "benchmark",
                "dataset": dataset_module,
                "metric": {
                    "name": metric_module}
            },
            {
                "name": nameOfBenchmark2ndRunnerName,
                "type": "benchmark",
                "dataset": dataset_2nd_module,
                "metric": {
                    "name": metric_module}
            }

        ]
    }

    # Example usage
    replace_yaml_content(yaml_file_path, updates)

    commands = [
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
    assert "Connection error.".replace(" ", "") in output_lines
    check_result_file_not_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")