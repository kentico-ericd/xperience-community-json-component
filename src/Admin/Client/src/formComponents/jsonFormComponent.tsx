import React from 'react';
import { FormComponentProps } from '@kentico/xperience-admin-base';
import {
    Button,
    ButtonColor,
    ButtonSize,
    FormEditMode,
    FormItemWrapper,
    Headline,
    HeadlineSize,
    Spacing
} from '@kentico/xperience-admin-components';
import { JsonInputElement, JsonInputType } from './jsonInputElement';

interface JsonFormComponentClientProperties extends FormComponentProps {
    inputs: JsonInput[] | null;
    errorMessage: string | null;
}

/** Corresponds with the C# class JsonInput */
export interface JsonInput {
    /** The name of the property being edited. */
    propertyName: string
    /** The label displayed for the property during editing. */
    label: string
    /** The input used for editing the property value. Values can be found in {@link JsonInputType} */
    type: number
    /** A list of options used by inputs like {@link JsonInputType.Dropdown}. */
    options: string | undefined
}

export const JsonFormComponent = (props: JsonFormComponentClientProperties) => {
    const jsonObjects: any[] = props.value ? JSON.parse(props.value) : [];

    /**
     * Updates the form with the field value (the serialized JSON object array).
     */
    const save = () => {
        if (props.onChange) {
            props.onChange(JSON.stringify(jsonObjects));
        }
    };

    /**
     * Handler for new JSON object button. Inserts empty JSON object into array and re-renders the field.
     */
    const insertObject = () => {
        const jsonObject: any = {};
        props.inputs?.forEach(i => {
            const defaultValue = getDefaultValue(i);
            jsonObject[i.propertyName] = defaultValue;
        });
        jsonObjects.push(jsonObject);
        save();
    };

    /**
     * Handler for the delete JSON object button. Deletes the object at the provided {@link index} and re-renders the field.
     */
    const deleteObject = (index: number) => {
        jsonObjects.splice(index, 1);
        save();
    };

    /**
     * Returns the default value of the provided {@link input}.
     */
    const getDefaultValue = (input: JsonInput) => {
        switch (input.type) {
            case JsonInputType.Checkbox:
                return false;
            case JsonInputType.Number:
                return 0;
            default:
            case JsonInputType.Text:
            case JsonInputType.Dropdown:
            case JsonInputType.RadioGroup:
            case JsonInputType.MultipleChoice:
                return '';
        }
    };

    /**
     * Converts each JSON object in the values array into a div containing inputs for each property.
     */
    const getObjectContainers = (): JSX.Element[] => {
        const jsonObjectsAsContainers: JSX.Element[] = [];

        // Loop through individual objects in value array
        jsonObjects.forEach((o, index) => {
            if (!props.inputs) {
                return;
            }

            const inputElements = props.inputs.map(i =>
                <JsonInputElement editMode={props.editMode ?? FormEditMode.Default} input={i} editedObject={o} onUpdate={save} />);
            const containerContent = insertBetween(<br />, inputElements);
            // Add header to beginning of content
            containerContent.unshift(getContainerHeader(index));
            jsonObjectsAsContainers.push(<div>{containerContent}</div>)
        });

        return jsonObjectsAsContainers;
    };

    /**
     * Gets the header for a JSON objects container, including the item number and delete button.
     */
    const getContainerHeader = (index: number) => {
        const deleteButton = <Button
            icon='xp-bin'
            title='Delete'
            borderless={true}
            size={ButtonSize.S}
            disabled={props.editMode === FormEditMode.Disabled}
            color={ButtonColor.Quinary}
            onClick={() => deleteObject(index)} />

        return <Headline
            size={HeadlineSize.S}
            spacingBottom={Spacing.S}
            spacingTop={Spacing.S}>
            {deleteButton} {'Item ' + (index + 1)}
        </Headline>
    };

    /**
     * Inserts the {@link separator} element between each element in the provided {@link elements} array.
     */
    const insertBetween = (separator: JSX.Element, elements: JSX.Element[]) =>
        elements.flatMap((x) => [separator, x]).slice(1);

    // If there was an error during the C# processing of the component, display the error
    if (props.errorMessage) {
        return <FormItemWrapper
            label={props.label}
            explanationText={props.explanationText}
            invalid={true}
            validationMessage={props.errorMessage}
            children={null}
            editMode={props.editMode}
            markAsRequired={props.required}
            labelIcon={props.tooltip ? 'xp-i-circle' : undefined}
            labelIconTooltip={props.tooltip} />
    }

    const containers = getObjectContainers();
    return <FormItemWrapper
        label={props.label}
        explanationText={props.explanationText}
        invalid={props.invalid}
        editMode={props.editMode}
        validationMessage={props.validationMessage}
        markAsRequired={props.required}
        labelIcon={props.tooltip ? 'xp-i-circle' : undefined}
        labelIconTooltip={props.tooltip}>

        {containers}
        <br />
        <Button
            label='New'
            icon='xp-plus'
            title='Add new item'
            disabled={props.editMode === FormEditMode.Disabled}
            onClick={insertObject} />
    </FormItemWrapper>
};
