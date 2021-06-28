use std::fs::OpenOptions;

use std::mem;
use winapi::shared::minwindef::DWORD;
use winapi::shared::minwindef::LPVOID;
use winapi::um::processthreadsapi::GetCurrentProcess;
use winapi::um::processthreadsapi::OpenProcessToken;
use winapi::um::securitybaseapi::GetTokenInformation;
use winapi::um::winnt::TokenElevation;
use winapi::um::winnt::HANDLE;
use winapi::um::winnt::TOKEN_ELEVATION;
use winapi::um::winnt::TOKEN_QUERY;

pub fn is_running_as_admin() -> Result<bool, bool> {

    // ? -> https://github.com/yandexx/is_elevated/blob/master/src/lib.rs

    unsafe {
        let mut current_token_ptr: HANDLE = mem::zeroed();
        let mut token_elevation: TOKEN_ELEVATION = mem::zeroed();
        let token_elevation_type_ptr: *mut TOKEN_ELEVATION = &mut token_elevation;
        let mut size: DWORD = 0;

        let result = OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut current_token_ptr);

        if result != 0 {
            let result = GetTokenInformation(
                current_token_ptr,
                TokenElevation,
                token_elevation_type_ptr as LPVOID,
                mem::size_of::<winapi::um::winnt::TOKEN_ELEVATION_TYPE>() as u32,
                &mut size,
            );
            if result != 0 {
                return Ok(token_elevation.TokenIsElevated != 0);
            }
        }
    }
    Ok(false)

    // match OpenOptions::new()
    // .write(true)
    // .open("C:\\Windows\\System32\\drivers\\etc\\hosts") {
    //     Ok(_) => {
    //         Ok(true)
    //     },
    //     Err(_) => {
    //         Ok(false)
    //     }
    // }

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