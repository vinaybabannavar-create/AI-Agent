from agents.vision_agent import run_vision
from agents.text_agent import run_text
from agents.fusion_agent import fuse
from agents.validation_agent import validate

def run_analysis():
    v = run_vision()
    t = run_text()
    f = fuse(v, t)
    return validate(f)
