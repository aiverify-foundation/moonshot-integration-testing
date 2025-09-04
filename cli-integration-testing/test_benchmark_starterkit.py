import subprocess
from dotenv import load_dotenv
import time
import random
import sys
import re
sys.path.append("..")
from util.utils import *
import time
import pprint

load_dotenv()  # Load environment variables from .env file

AZURE_OPENAI_URI = os.getenv('AZURE_OPENAI_URI')
AZURE_OPENAI_TOKEN = os.getenv('AZURE_OPENAI_TOKEN')
TOGETHER_TOKEN= os.getenv('TOGETHER_TOKEN')
# CLI_DIR = '/Users/jacksonboey/PycharmProjects/moonshot'
CLI_DIR = os.getenv('CLI_DIR')
# CLI_DIR = '/Users/jacksonboey/PycharmProjects/moonshot'


def open_moonshot_process():
    command = get_moonshot_command()
    process = subprocess.Popen(
        command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(CLI_DIR),
    )
    print('Path:', str(CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")
    return process

# This is not a fixture because it's not meant to cause multiple runs of the same test
def endpoint_setup_azure_gpt4o(id, name):
    start_time = time.perf_counter()
    process = open_moonshot_process()
    #constants
    COMMAND_PARAMS = {'timeout': 300, 'max_attempts': 3, 'temperature': 0.5}

    # Update Endpoints
    command = (
        f'update_endpoint {id} '
        f'"[(\'name\', \'{name}\'), '
        f'(\'uri\', \'{AZURE_OPENAI_URI}\'), '
        f'(\'token\', \'{AZURE_OPENAI_TOKEN}\'), '
        f'(\'model\', \'gpt-4o-mini\'), '
        f'(\'params\', {COMMAND_PARAMS})]"'
        )
    print('Command:', command)
    # Example command to send to the process
    process.stdin.write(command)
    process.stdin.flush()        
    # Capture the output and errors this also waits for the process to finish this is required to ensure the endpoint is updated before termination
    stdout, stderr = process.communicate()# This is a blocking call, this will wait for the CLI to finish printing out before continuing.
    print('Output:', stderr)
    print('Output:', stdout)
    end_time = time.perf_counter()
    print(f"Time taken for endpoint execution: {end_time - start_time:.2f} seconds")
    process.terminate()

def assert_cookbook_result(output_lines, recipes, cookbook_id):
    """
    Asserts that the cookbook has been run and the following is present in the number of lines specified from the end of the output lines.
    - The cookbook ID
    - The cookbook result line
    - The recipes that were run
    """

    if not output_lines:
        raise ValueError("output lines are empty")
    
    start_time = time.perf_counter()
    COOKBOOK_RESULT_PATTERN = r"Cookbook.*Result"
    DATETIME_PATTERN = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}"
    isCookbookResultPresent = False
    isCookbookIdPresent = False
    recipe_dict = {recipe: False for recipe in recipes}
    # the [::-1] slice reverses the list
    for line in output_lines[::-1]:
        if re.search(cookbook_id, line):
            isCookbookIdPresent = True
            continue
        if re.search(COOKBOOK_RESULT_PATTERN, line):
            isCookbookResultPresent = True
            break # This assumes that cookbook result is before the recipes
        for recipe in recipes:
            if re.search(recipe, line):
                recipe_dict[recipe] = True
                continue
        if re.search(DATETIME_PATTERN, line):
            break # This assumes that Datetime will only show up after any important result and will terminate early.

    # Check if cookbook ID is present
    assert isCookbookIdPresent, f"Cookbook ID '{cookbook_id}' not found in the output lines."
    # Check if all recipes are present
    for recipe, present in recipe_dict.items():        
        if not present:
            print("list of recipes: \n")
            pprint.pprint(recipe_dict)            
        assert present, f"Recipe '{recipe}' not found in the output lines."
    
    end_time = time.perf_counter()
    duration = end_time - start_time
    print(f"Time taken to assert cookbook result: {duration:.2f} seconds")
    assert isCookbookResultPresent, f"Expected '{COOKBOOK_RESULT}' to be present in the output lines"

class TestStarterKit:
    @classmethod
    def setup_class(cls):
        endpoint_setup_azure_gpt4o("azure-openai-gpt4o", "Azure OpenAI GPT4o")
        pass

    def run_benchmark(self, process, recipes, cookbook_id, endpoint_id="azure-openai-gpt4o"):
        # Generate a random number between 0 and 999,999,999 (inclusive)
        random_number = int(random.random() * 1000000000) # look into uuid
        nameOfRunnerName = "my benchmarking runner " + str(random_number)
        command = f'run_cookbook "{nameOfRunnerName}" "[\'{cookbook_id}\']" "[\'{endpoint_id}\']" -n 1 -r 1 -s "You are an intelligent AI"\n'
        print('Command:', command)
        # Example command to send to the process
        process.stdin.write(command)
        process.stdin.flush()

        # Capture the output and errors
        stdout, stderr = process.communicate()# This is a blocking call, this will wait for the CLI to finish printing out before continuing.
        print('Output:', stderr)
        print('Output:', stdout)
        # Split the output into lines
        output_lines = stdout.splitlines()
        assert_cookbook_result(output_lines, recipes, cookbook_id)

    def test_cli_run_starter_kit_hallucination(self):
        with open_moonshot_process() as moonshot_process:
            recipes = [
                "mmlu",
                "singapore-facts-tf",
                "singapore-facts-mcq"
            ]
            self.run_benchmark(moonshot_process, recipes, "hallucination")

    def test_cli_run_starter_kit_undesirable_content(self):
        with open_moonshot_process() as moonshot_process:
            recipes = [
                "singapore-safety",
                "real-toxicity-prompts-completion",
                "mlc-vcr-en",
                "mlc-ncr-en",
                "mlc-ailuminate-cse",
                "mlc-ailuminate-hte",
                "mlc-ailuminate-iwp",
                "mlc-ailuminate-ncr",
                "mlc-ailuminate-spc-ele",
                "mlc-ailuminate-spc-fin",
                "mlc-ailuminate-spc-hlt",
                "mlc-ailuminate-spc-lgl",
                "mlc-ailuminate-src",
                "mlc-ailuminate-ssh",
                "mlc-ailuminate-sxc-prn",   
                "mlc-ailuminate-vcr"
            ]
            self.run_benchmark(moonshot_process, recipes, "undesirable-content")

    def test_cli_run_starter_kit_adversarial_attacks(self):
        with open_moonshot_process() as moonshot_process:
            recipes = [
                "cyberseceval-en"
            ]
            self.run_benchmark(moonshot_process, recipes, "adversarial-attacks")

    def test_cli_run_starter_kit_data_disclosure(self):
        with open_moonshot_process() as moonshot_process:
            recipes = [
                "mlc-prv-en"
            ]
            self.run_benchmark(moonshot_process, recipes, "data-disclosure")