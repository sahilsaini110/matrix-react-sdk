/*
Copyright 2020 The Matrix.org Foundation C.I.C.
Copyright 2021 - 2022 Šimon Brandner <simon.bra.ag@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";

import {
    KEYBOARD_SHORTCUTS,
    ALTERNATE_KEY_NAME,
    KEY_ICON,
    ICategory,
    CATEGORIES,
    CategoryName,
} from "../../../../../accessibility/KeyboardShortcuts";
import { isMac, Key } from "../../../../../Keyboard";
import { _t } from "../../../../../languageHandler";

interface IKeyboardKeyProps {
    name: string;
    last?: boolean;
}

export const KeyboardKey: React.FC<IKeyboardKeyProps> = ({ name, last }) => {
    const icon = KEY_ICON[name];
    const alternateName = ALTERNATE_KEY_NAME[name];

    return <React.Fragment>
        <kbd> { icon || (alternateName && _t(alternateName)) || name } </kbd>
        { !last && "+" }
    </React.Fragment>;
};

interface IKeyboardShortcutProps {
    name: string;
}

export const KeyboardShortcut: React.FC<IKeyboardShortcutProps> = ({ name }) => {
    const value = KEYBOARD_SHORTCUTS[name]?.default;
    if (!value) return null;

    const modifiersElement = [];
    if (value.ctrlOrCmdKey) {
        modifiersElement.push(<KeyboardKey key="ctrlOrCmdKey" name={isMac ? Key.META : Key.CONTROL} />);
    } else if (value.ctrlKey) {
        modifiersElement.push(<KeyboardKey key="ctrlKey" name={Key.CONTROL} />);
    } else if (value.metaKey) {
        modifiersElement.push(<KeyboardKey key="metaKey" name={Key.META} />);
    }
    if (value.altKey) {
        modifiersElement.push(<KeyboardKey key="altKey" name={Key.ALT} />);
    }
    if (value.shiftKey) {
        modifiersElement.push(<KeyboardKey key="shiftKey" name={Key.SHIFT} />);
    }

    return <div>
        { modifiersElement }
        <KeyboardKey name={value.key} last />
    </div>;
};

interface IKeyboardShortcutRowProps {
    name: string;
}

const KeyboardShortcutRow: React.FC<IKeyboardShortcutRowProps> = ({ name }) => {
    return <div className="mx_KeyboardShortcut_shortcutRow">
        { KEYBOARD_SHORTCUTS[name].displayName }
        <KeyboardShortcut name={name} />
    </div>;
};

interface IKeyboardShortcutSectionProps {
    categoryName: CategoryName;
    category: ICategory;
}

const KeyboardShortcutSection: React.FC<IKeyboardShortcutSectionProps> = ({ categoryName, category }) => {
    return <div className="mx_SettingsTab_section" key={categoryName}>
        <div className="mx_SettingsTab_subheading">{ _t(category.categoryLabel) }</div>
        <div> { category.settingNames.map((shortcutName) => {
            return <KeyboardShortcutRow key={shortcutName} name={shortcutName} />;
        }) } </div>
    </div>;
};

const KeyboardUserSettingsTab: React.FC = () => {
    return <div className="mx_SettingsTab mx_KeyboardUserSettingsTab">
        <div className="mx_SettingsTab_heading">{ _t("Keyboard") }</div>
        { Object.entries(CATEGORIES).map(([categoryName, category]: [CategoryName, ICategory]) => {
            return <KeyboardShortcutSection key={categoryName} categoryName={categoryName} category={category} />;
        }) }
    </div>;
};

export default KeyboardUserSettingsTab;
