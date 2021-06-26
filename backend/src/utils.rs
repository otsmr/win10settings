use std::fs::OpenOptions;

pub fn is_running_as_admin() -> Result<bool, bool> {

    match OpenOptions::new()
    .write(true)
    .open("C:\\Windows\\System32\\drivers\\etc\\hosts") {
        Ok(_) => {
            Ok(true)
        },
        Err(_) => {
            Ok(false)
        }
    }

}

// SOURCE: https://github.com/amodm/webbrowser-rs/blob/master/src/windows.rs

extern crate widestring;
extern crate winapi;

pub use std::os::windows::process::ExitStatusExt;
use std::process::ExitStatus;
use std::ptr;
use widestring::U16CString;

/// Deal with opening of browsers on Windows, using [`ShellExecuteW`](
/// https://docs.microsoft.com/en-us/windows/desktop/api/shellapi/nf-shellapi-shellexecutew)
/// fucntion.
#[inline]
pub fn open_webpage(url: &str) -> Result<ExitStatus, ()> {
    
    use winapi::shared::winerror::SUCCEEDED;
    use winapi::um::combaseapi::{CoInitializeEx, CoUninitialize};
    use winapi::um::objbase::{COINIT_APARTMENTTHREADED, COINIT_DISABLE_OLE1DDE};
    use winapi::um::shellapi::ShellExecuteW;
    use winapi::um::winuser::SW_SHOWNORMAL;

    static OPEN: &[u16] = &['o' as u16, 'p' as u16, 'e' as u16, 'n' as u16, 0x0000];
    let url =
        U16CString::from_str(url).map_err(|_e| 0).unwrap();
    let code = unsafe {
        let coinitializeex_result = CoInitializeEx(
            ptr::null_mut(),
            COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE,
        );
        let code = ShellExecuteW(
            ptr::null_mut(),
            OPEN.as_ptr(),
            url.as_ptr(),
            ptr::null(),
            ptr::null(),
            SW_SHOWNORMAL,
        ) as usize as i32;
        if SUCCEEDED(coinitializeex_result) {
            CoUninitialize();
        }
        code
    };
    if code > 32 {
        Ok(ExitStatus::from_raw(0))
    } else {
        Err(())
    }

}