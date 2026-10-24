import React, { useState } from "react";
import moment from "moment";

import { TextField, Tooltip } from "@material-ui/core";

import { Autocomplete, useModulesManager, useTranslations } from "@openimis/fe-core";
import { DATE_FORMAT, EMPTY_STRING, PRODUCT_QUANTITY_LIMIT } from "../constants";
import { useProductsQuery } from "../hooks";

/**
 * The `location` filter of the products query: the backend answers with the products of
 * that location, of its ancestors and the national ones (no location), so the caller
 * passes the most specific location it has (a family's village) and the picker does not
 * narrow the result any further. An id that is not one (a missing parent decoded, say)
 * is dropped rather than sent, as it would fail the whole query.
 */
const locationFilter = (locationId) => {
  const id = parseInt(locationId, 10);
  return Number.isNaN(id) ? undefined : id;
};

const ProductPicker = (props) => {
  const {
    multiple,
    required,
    label,
    nullLabel,
    withLabel = false,
    placeholder,
    withPlaceholder = false,
    readOnly,
    value,
    onChange,
    filter,
    filterSelectedOptions,
    locationId,
    enrollmentDate,
    canFetch,
    invalidAgeError
  } = props;
  const modulesManager = useModulesManager();
  const [filters, setFilters] = useState({
    location: locationFilter(locationId),
  });
  const [currentString, setCurrentString] = useState(EMPTY_STRING);
  const { formatMessage, formatMessageWithValues } = useTranslations("product", modulesManager);
  const {
    isLoading,
    error,
    data: { products },
  } = useProductsQuery({ filters }, { skip: true });
  const shouldShowTooltip = products.length >= PRODUCT_QUANTITY_LIMIT && !value && !currentString;

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      error={error}
      readOnly={readOnly}
      options={ canFetch && canFetch == true ? products : canFetch == undefined ? products : [] }
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.code} ${option.name}`}
      onChange={(value) => onChange(value, value ? `${value.code} ${value.name}` : null)}
      setCurrentString={setCurrentString}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(search) =>
        setFilters(() => ({
          first: PRODUCT_QUANTITY_LIMIT,
          search,
          location: locationFilter(locationId),
          dateFrom: moment(enrollmentDate).format(DATE_FORMAT),
          dateTo: moment(enrollmentDate).format(DATE_FORMAT),
        }))
      }
      renderInput={(inputProps) => (
        <Tooltip
          title={
            shouldShowTooltip
              ? formatMessageWithValues("ProductPicker.aboveLimit", { limit: PRODUCT_QUANTITY_LIMIT })
              : EMPTY_STRING
          }
        >
          <TextField
            {...inputProps}
            required={required}
            label={(withLabel && (label || nullLabel)) || formatMessage("Product")}
            placeholder={(withPlaceholder && placeholder) || formatMessage("ProductPicker.placeholder")}
            error={!!invalidAgeError}
            helperText={invalidAgeError}
          />
        </Tooltip>
      )}
    />
  );
};

export default ProductPicker;
