import React from "react";

import Toggle from '../../../forms/toggle';
import A from '../../../forms/a';

interface IProps {}
interface IState {}

export default class Taskbar extends React.Component<IProps, IState > {

    render () {

        return (

            <div>

                <br />
                <h2>Tray-Icons</h2>
                <p>Diese Änderung wird erst nach einem Neustart des Windows-Explorers wirksam.</p>
                <label>Alle Tray-Icons anzeigen</label>
                <Toggle configID="personalization:taskbar:showTrayIcons" onText="An" offText="Aus" />

                <h2>Suchfeld</h2>
                <p> TIPP: Eine gute Open-Source-Alternative zur Windows-Suche ist der <A href="https://github.com/otsmr/launcher">Launcher</A> - Schnellzugriff auf Einstellungen, Webseiten oder Programmen. </p>
                <label>Suchfeld ausblenden</label>
                <Toggle configID="personalization:taskbar:searchboxTaskbarMode" onText='An' offText='Aus' />

            </div>

        )

    }

}