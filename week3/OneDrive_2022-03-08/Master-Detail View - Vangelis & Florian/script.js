const Observable = value => {
    const listeners     = [];
    let originalValue   = value;
    let dirty           = false;
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            dirty = false;
            if (value === newValue) return;
            const oldValue  = value;
            value           = newValue;
            originalValue   = value;
            listeners.forEach(callback => callback(value, oldValue));
        },
        setTempValue: tempValue => {
            if (!dirty) {
                originalValue   = value;
                dirty           = true;
            }
            value = tempValue;
            listeners.forEach(callback => callback(originalValue, value))
        },
        resetValue: () => {
            if (dirty) {
                value = originalValue;
                listeners.forEach(callback => callback(value, value));
                dirty = false;
            }
        }
    }
};

const Entry = (_id) => {
    const id              = 'person-id-' + _id;
    const firstname       = Observable('');
    const lastname        = Observable('');
    const func            = Observable('');
    const availability    = Observable(false);

    return {
        getId: ()           => id,
        getFirstname: ()    => firstname,
        getLastname: ()     => lastname,
        getFunction: ()     => func,
        getAvailability: () =>  availability,
        save: () => {
            firstname.setValue(firstname.getValue());
            lastname.setValue(lastname.getValue());
            func.setValue(func.getValue());
            availability.setValue(availability.getValue());
        },
        reset: () => {
            firstname.resetValue();
            lastname.resetValue();
            func.resetValue();
            availability.resetValue();
        }
    };
}

const View = () => {
    const buttonAdd     = document.getElementById('add');
    const buttonRemove  = document.getElementById('remove');
    const buttonReset   = document.getElementById('reset');
    const buttonSave    = document.getElementById('save');
    const tableContent  = document.getElementById('table-content');
    const detailContent = document.getElementById('detail-container');

    const Form = {
        firstnameInput:         document.getElementById('firstname'),
        lastnameInput:          document.getElementById('lastname'),
        functionInput:          document.getElementById('function'),
        availabilityYesInput:   document.getElementById('availabilityYes'),
        availabilityNoInput:    document.getElementById('availabilityNo'),
        registerEntry:          (entry) => {
            Form.firstnameInput.onchange            = () => entry.getFirstname().setTempValue(Form.firstnameInput.value);
            Form.lastnameInput.onchange             = () => entry.getLastname().setTempValue(Form.lastnameInput.value);
            Form.functionInput.onchange             = () => entry.getFunction().setTempValue(Form.functionInput.value);
            Form.availabilityYesInput.onchange      = () => entry.getAvailability().setTempValue(Form.availabilityYesInput.checked);
            Form.availabilityNoInput.onchange       = () => entry.getAvailability().setTempValue(!Form.availabilityNoInput.checked);
            Form.firstnameInput.value               = entry.getFirstname().getValue();
            Form.lastnameInput.value                = entry.getLastname().getValue();
            Form.functionInput.value                = entry.getFunction().getValue();
            if (entry.getAvailability().getValue() === true) {
                Form.availabilityYesInput.checked   = true;
                Form.availabilityNoInput.checked    = false;
            } else {
                Form.availabilityNoInput.checked    = true;
                Form.availabilityYesInput.checked   = false;
            }
        },
        reset: () => {
            const resetFunc = (input) => {
                const onClickEvent  = input.onclick;
                input.onclick       = null;
                input.value         = '';
                input.onclick       = onClickEvent;
            }
            resetFunc(Form.firstnameInput);
            resetFunc(Form.lastnameInput);
            resetFunc(Form.functionInput);
            resetFunc(Form.availabilityYesInput);
            resetFunc(Form.availabilityNoInput);
        }
    }

    return {
        createTableEntry: (entryElement) => {
            const entry     = document.createElement('tr');
            entry.id        = entryElement.getId();
            entry.class     = 'list-entry';
            entry.tabIndex  = '0';
            entry.innerHTML = '<td class="entry-firstname"></td>' +
                              '<td class="entry-lastname"></td>' +
                              '<td class="entry-function"></td>' +
                              '<td class="entry-availability">false</td>';

            entry.addEventListener('focus', (event) => {
                const activeElement = document.getElementsByClassName('active');
                if(activeElement.length){
                    activeElement[0].classList.remove('active');
                }
                event.currentTarget.classList.add('active');
                
                Form.registerEntry(entryElement);
                detailContent.style.display    = 'block';
            });

            tableContent.appendChild(entry);
        },
        updateRow: (entry, field) => {
            return () => {
                const activeElement = document.getElementsByClassName('active')[0];
                if (activeElement && activeElement.id == entry.getId()) {
                    const fieldWithUpper = field.charAt(0).toUpperCase() + field.slice(1);
                    activeElement.getElementsByClassName('entry-' + field)[0].innerHTML = entry['get' + fieldWithUpper]().getValue();
                    activeElement.getElementsByClassName('entry-' + field)[0].classList.add('modifyed');
                    activeElement.classList.add('dirty');
                }
            }
        },
        setRowAsSavedOrReset: () => {
            const activeElement = document.getElementsByClassName('active')[0];
            var elements        = activeElement.getElementsByClassName('modifyed');
            for (var i = 0; i < elements.length;) {
                elements[0].classList.remove('modifyed');
            }
            activeElement.classList.remove('dirty');
        },
        removeRow: () => {
            const activeElement = document.getElementsByClassName('active')[0];
            activeElement.remove();
            Form.reset();
            detailContent.style.display = 'none';
        },
        getSelectedEntry: () => {
            return document.getElementsByClassName('active')[0];
        },
        getButtonAdd: ()    => buttonAdd,
        getButtonSave: ()   => buttonSave,
        getButtonRemove: () => buttonRemove,
        getButtonReset: ()  => buttonReset,
    }
}

const Controller = () => {
    let idCounter   = 0;
    const entries   = [];
    const view      = View();

    const getSelectedEntry = () => {
        const activeElementId = view.getSelectedEntry().id;
        return entries.find(o => o.getId() == activeElementId);
    }

    const addEntry = () => {
        const newEntry = Entry(idCounter++);
        entries.push(newEntry);
        view.createTableEntry(newEntry);
        newEntry.getFirstname().onChange(view.updateRow(newEntry, "firstname"));
        newEntry.getLastname().onChange(view.updateRow(newEntry, "lastname"));
        newEntry.getFunction().onChange(view.updateRow(newEntry, "function"));
        newEntry.getAvailability().onChange(view.updateRow(newEntry, "availability"));
    };

    const removeEntry = () => {
        const currentSelected = getSelectedEntry();
        entries.slice(entries.indexOf(currentSelected), 1);
        view.removeRow();
    };

    const saveEntry = () => {
        const currentSelected = getSelectedEntry();
        currentSelected.save();
        view.setRowAsSavedOrReset();
    };

    const resetEntry = () => {
        const currentSelected = getSelectedEntry();
        currentSelected.reset();
        view.setRowAsSavedOrReset();
    }

    view.getButtonAdd().onclick     = addEntry;
    view.getButtonSave().onclick    = saveEntry;
    view.getButtonRemove().onclick  = removeEntry;
    view.getButtonReset().onclick   = resetEntry;
}

const controller = Controller();