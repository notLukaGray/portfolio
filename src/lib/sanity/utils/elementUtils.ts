import { ELEMENT_TYPES } from "./constants";
import { GlassLocalizationInput } from "../components/GlassLocalizationInput";
import { GenericComputedFieldsInput } from "../components/GenericComputedFieldsInput";
import { SanityField } from "../types";

export const getElementTypeFromDocument = (
  docType: string | undefined,
): string => {
  if (!docType || typeof docType !== "string") return "default";

  return (
    ELEMENT_TYPES[docType as keyof typeof ELEMENT_TYPES] ||
    docType.replace("element", "").toLowerCase()
  );
};

export const mapElementFields = (
  fields: SanityField[],
  elementType: string,
) => {
  return fields.map((field) => {
    // Convert title and description to glassLocaleString (single line)
    if (field.name === "title" || field.name === "description") {
      return {
        ...field,
        type: "glassLocaleString",
        components: { input: GlassLocalizationInput },
        options: {
          fieldType: "string",
        },
        description: field.description,
      };
    }

    // Convert alternativeTitle and caption to glassLocaleText (multi-line)
    if (field.name === "alternativeTitle" || field.name === "caption") {
      return {
        ...field,
        type: "glassLocaleText",
        components: { input: GlassLocalizationInput },
        options: {
          fieldType: "text",
        },
        description: field.description,
      };
    }

    // Update computedFields with element type
    if (field.name === "computedFields") {
      return {
        ...field,
        components: { input: GenericComputedFieldsInput },
        options: {
          elementType: elementType,
        },
      };
    }

    return field;
  });
};
