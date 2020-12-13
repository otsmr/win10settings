import React from "react";
import Toggle from '../../../forms/toggle';

export default () => {
    return (
        <div>
    
            <h2>Explorer</h2>
            <br />
            <label>Datei-Endungen immer anzeigen</label>
            <Toggle configID="explorer:folderoptions:fileextensions" onText="An" offText="Aus" />
    
            <label>Explorer öffnen mit</label>
            <Toggle configID="explorer:folderoptions:openwith" onText='"Dieser PC"' offText='"Schnellzugriff"' />
    
        </div>
    )
}