<p align="center">
  <a href="https://tsmr.eu">
    <img src="frontend/public/img/logo-dark.png" width="150">
  </a>
</p>

<h3 align="center">Erweiterte Windows-Einstellungen</h3>

<p align="center">
    Erweiterte Windows-Einstellungen ist eine Sammlung von <b>nützlichen<br> und datenschutzfreundlichen</b> Einstellungen für Windows.<br>
    Einstellungen, die nicht in der offiziellen Dokumentation von<br>Microsoft enthalten sind, werden zunächst erläutert und<br><b>sind mit einer Quellenangabe versehen</b>. 
    <br><br>
    --- <a href="https://win10settings.oproj.de/"><strong>Webseite </strong></a> ---
    <a href="#download"><strong>Download</strong></a> ---
    <br>
    <br>
    <img src="https://img.shields.io/badge/platform-Windows%2010-%23097aba" alt="Platform">
    <a href="https://paypal.me/otsmr"><img src="https://img.shields.io/badge/PayPal-Kaffee spendieren-%23097aba" alt="Kaffee"></a>
    <br>
    <br>
</p>

<img src="public/img/startpage.png" alt="Platform">

# Inhaltsverzeichnis
* <a href="#features">Features</a>
* <a href="#download">Download</a>
* <a href="#dokumentation">Dokumentation</a>
* <a href="#copyright-und-lizenz">Copyright und Lizenz</a>

# Features

* Mehr **Datenschutz für Windows 10**
* **Datenschutzniveau** nach **BSI-Empfehlung**
* **Werbung** in Windows 10 **deaktivieren**
* Einstellungen um die **SSD zu schonen** 
* Windows-**Apps** mit **einem Klick entfernen**
* Explorer **Ordner-Verknüpfungen entfernen** (3D-Objekte, Musik, ...)
* Programm-Verknüpfungen im Explorer entfernen (OneDrive, Adobe, ...)
* **Datei-Hash** mit einem Klick erzeugen (**SHA1**, **SHA256**, ...)

# Download

<b>Laden Sie die aktuellste Version von der <a href="https://win10settings.oproj.de/">Webseite</a> oder der <a href="https://github.com/otsmr/win10settings/releases">Releases-Seite</a> herunter.</b>

# Installieren

```powershell
# cd frontend
npm install
npm build
```

```powershell
# cd backend
cargo build
# cargo run
```

## Komandozeile

```powershell
.\target\debug\win10setting.exe c "{'id':'privacy:telemetrie:allowtelemetry','method':'get'}"
.\target\debug\win10setting.exe c "{'id':'privacy:telemetrie:allowtelemetry','method':'set','body':{'checked':false}}"
```

## Sprachen

## Datenschutz
https://www.der-windows-papst.de/wp-content/uploads/2019/06/Privatsph%C3%A4re-f%C3%BCr-Windows-10-Pro-Heimarbeitspl%C3%A4tze.pdf  
https://www.der-windows-papst.de/2015/12/24/windows-10-spy-deaktivieren/  
https://www.der-windows-papst.de/2019/01/08/datenschutz-fuer-windows-10-registry-hacks/  

**E-Mail-Adressen**  
Computer\HKEY_CURRENT_USER\Software\Microsoft\IdentityCRL\UserExtendedProperties  

## Sicherheit
**Office**  
https://www.der-windows-papst.de/2019/01/10/security-fuer-windows-10-registry-hacks/  

**Windows Updates verhindern**  
https://www.der-windows-papst.de/2016/11/30/ethernet-verbindungen-in-windows-10-als-getaktete-verbindung-einstellen/



## Personalisierung

**NoLockScreen**  
https://www.der-windows-papst.de/2016/01/10/windows-10-nolockscreen/



# Copyright und Lizenz
<!-- TODO -->
https://github.com/neutralinojs/neutralinojs/blob/master/LICENSE
Copyright by <a href="https://tsmr.eu">TSMR</a>
