import os,sys,runpy
from playwright.sync_api import BrowserType
old=BrowserType.launch
def launch(self,*a,**kw):
    kw['executable_path']=os.environ['F02_REVIEW_BROWSER']
    kw['args']=['--no-sandbox','--disable-dev-shm-usage']
    return old(self,*a,**kw)
BrowserType.launch=launch
sys.argv=['tools/ux-f02-check.py','--root',os.environ['F02_REVIEW_ROOT'],'--round','reviewer-r1']
runpy.run_path(os.path.join(os.environ['F02_REVIEW_ROOT'],'tools/ux-f02-check.py'),run_name='__main__')
