copy __nw\* dist\
copy xstu.zip dist\

ren dist\xstu.zip xstu.nw
copy /b dist\nw.exe+dist\xstu.nw dist\xstu.exe

del dist\xstu.nw
del dist\nw.exe