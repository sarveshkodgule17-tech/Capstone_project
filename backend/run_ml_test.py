import os, sys

# Switch to the hackathon project folder so relative paths work
os.chdir(r"C:\Users\Sarvesh Kodgule\Downloads\Hackthon project\Hackthon project")
sys.path.insert(0, os.getcwd())

# Now run the test
from test_model import main
main()
