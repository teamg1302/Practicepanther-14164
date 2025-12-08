/**
 * Async Multi Select with Pagination component for React Hook Form.
 * Supports search, infinite scroll, load more functionality, and displays selected values as tags.
 * @module feature-module/components/form-elements/async-multi-select-pagination
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AsyncSelect from "react-select/async";
import { components } from "react-select";

/**
 * Async Multi Select with Pagination component props.
 * @typedef {Object} AsyncMultiSelectPaginationProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the select
 * @property {Function} api - API function to fetch options
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional CSS classes
 * @property {string} [placeholder] - Placeholder text
 * @property {number} [pageSize=50] - Number of items per page
 * @property {string} [searchKey="search"] - API parameter name for search query
 * @property {Function} [formatOptionLabel] - Custom function to format option labels
 * @property {Function} [getOptionValue] - Custom function to get option value
 * @property {Function} [getOptionLabel] - Custom function to get option label
 */

/**
 * Custom MenuList component that supports infinite scroll
 */
const MenuList = ({ children, ...props }) => {
  const menuListRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { loadMore, hasMore, isLoading, currentSearch } = props.selectProps;

  const handleScroll = useCallback(
    async (e) => {
      const { target } = e;

      // Check if we're near the bottom (within 100px)
      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight - 100 &&
        hasMore &&
        !isLoading &&
        !isLoadingMore &&
        loadMore
      ) {
        setIsLoadingMore(true);
        try {
          await loadMore(currentSearch);
        } catch (error) {
          console.error("Error loading more:", error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    },
    [hasMore, isLoading, isLoadingMore, loadMore, currentSearch]
  );

  useEffect(() => {
    const menuList = menuListRef.current;
    if (menuList) {
      menuList.addEventListener("scroll", handleScroll);
      return () => {
        menuList.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <components.MenuList {...props} ref={menuListRef}>
      {children}
      {isLoadingMore && (
        <div
          style={{
            padding: "8px 12px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Loading more...
        </div>
      )}
    </components.MenuList>
  );
};

MenuList.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object,
};

/**
 * Custom MultiValue component to display tags
 */
const MultiValue = (props) => {
  return (
    <components.MultiValue
      {...props}
      style={{
        backgroundColor: "rgba(255, 159, 67, 0.1)",
        borderRadius: "4px",
        border: "1px solid rgba(255, 159, 67, 0.3)",
        padding: "2px 8px",
        margin: "2px",
      }}
    >
      {props.children}
    </components.MultiValue>
  );
};

MultiValue.propTypes = {
  children: PropTypes.node,
};

/**
 * Async Multi Select with Pagination component that fetches options dynamically.
 * Supports search, infinite scroll pagination, and displays selected values as tags.
 *
 * @param {AsyncMultiSelectPaginationProps} props - Component props
 * @returns {JSX.Element} Async Multi Select component with pagination and tag display
 *
 * @example
 * <AsyncMultiSelectPagination
 *   name="tags"
 *   label="Tags"
 *   api={getTags}
 *   pageSize={50}
 * />
 */
const AsyncMultiSelectPagination = ({
  name,
  label,
  api,
  required = false,
  className = "",
  placeholder,
  pageSize = 50,
  searchKey = "search",
  formatOptionLabel,
  getOptionValue,
  getOptionLabel,
  ...rest
}) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const paginationStateRef = useRef({}); // Track pagination state by search query
  const selectedOptionsCache = useRef({}); // Cache selected options by value to preserve labels

  const selectId = name;
  const error = errors[name];
  const hasError = !!error;
  const errorMessage = error?.message;
  const selectAriaLabel = label;
  const defaultPlaceholder =
    placeholder || t("formElements.select.placeholder") || "Select...";

  /**
   * Transform API response to options format
   */
  const transformOptions = useCallback(
    (response) => {
      if (!response) {
        return [];
      }

      // Handle different response structures
      let items = [];

      if (Array.isArray(response?.list)) {
        items = response.list;
      } else if (Array.isArray(response?.data?.list)) {
        items = response.data.list;
      } else if (Array.isArray(response?.data)) {
        items = response.data;
      } else if (Array.isArray(response)) {
        items = response;
      } else if (response?.data && Array.isArray(response.data)) {
        items = response.data;
      }

      if (!Array.isArray(items) || items.length === 0) {
        return [];
      }

      const transformed = items.map((item) => {
        if (getOptionValue && getOptionLabel) {
          return {
            label: getOptionLabel(item),
            value: getOptionValue(item),
            data: item,
          };
        }

        // Default transformation
        return {
          label:
            item.name ||
            item.label ||
            item.firstName ||
            `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
            item.email ||
            String(item._id || item.id),
          value: item._id || item.id || item.value,
          data: item,
        };
      });

      return transformed;
    },
    [getOptionValue, getOptionLabel]
  );

  /**
   * Load options for the select (called by AsyncSelect)
   */
  const loadOptions = useCallback(
    (inputValue, callback) => {
      const searchValue = inputValue || "";
      setCurrentSearch(searchValue);

      // Check if we have cached options for this search
      const cacheKey = searchValue;
      if (paginationStateRef.current[cacheKey]) {
        const cached = paginationStateRef.current[cacheKey];
        setAllOptions(cached.options);
        setHasMore(cached.hasMore);
        setCurrentPage(cached.page);

        // Update selected options cache with cached options
        cached.options.forEach((option) => {
          selectedOptionsCache.current[option.value] = option;
        });

        // Return cached options immediately
        callback(cached.options);
        return;
      }

      // Reset state for new search
      setCurrentPage(1);
      setAllOptions([]);
      setHasMore(true);
      setIsLoading(true);

      const params = {
        page: 1,
        limit: pageSize,
        pageSize: pageSize,
        [searchKey]: searchValue,
      };

      // Make API call
      api(params)
        .then((response) => {
          const options = transformOptions(response);

          // Check if there are more pages
          const totalItems =
            response?.total || response?.data?.total || response?.count || 0;
          const currentTotal = options.length;
          const hasMorePages =
            currentTotal >= pageSize &&
            (totalItems === 0 || currentTotal < totalItems);

          // Update state
          setAllOptions(options);
          setHasMore(hasMorePages);
          setCurrentPage(1);

          // Update selected options cache with new options
          options.forEach((option) => {
            selectedOptionsCache.current[option.value] = option;
          });

          // Cache the results
          paginationStateRef.current[cacheKey] = {
            options,
            hasMore: hasMorePages,
            page: 1,
            total: totalItems,
          };

          // Call callback with options - this is critical for AsyncSelect to display them
          if (options && options.length > 0) {
            callback(options);
          } else {
            callback([]);
          }
        })
        .catch((err) => {
          console.error("Error loading options:", err);
          setHasMore(false);
          setAllOptions([]);
          callback([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [api, pageSize, searchKey, transformOptions]
  );

  /**
   * Load more options (for infinite scroll)
   */
  const loadMore = useCallback(
    async (searchValue) => {
      if (isLoading) return;

      const cacheKey = searchValue || "";
      const state = paginationStateRef.current[cacheKey];

      if (!state || !state.hasMore) {
        return;
      }

      try {
        setIsLoading(true);

        const nextPage = state.page + 1;
        const params = {
          page: nextPage,
          limit: pageSize,
          pageSize: pageSize,
          [searchKey]: searchValue || "",
        };

        const response = await api(params);
        const newOptions = transformOptions(response);

        if (newOptions.length > 0) {
          const updatedOptions = [...state.options, ...newOptions];
          const totalItems =
            state.total ||
            response?.total ||
            response?.data?.total ||
            response?.count ||
            0;
          const totalLoaded = updatedOptions.length;
          const hasMorePages =
            totalLoaded < totalItems && newOptions.length >= pageSize;

          // Update cache
          paginationStateRef.current[cacheKey] = {
            ...state,
            options: updatedOptions,
            hasMore: hasMorePages,
            page: nextPage,
          };

          setAllOptions(updatedOptions);
          setHasMore(hasMorePages);
          setCurrentPage(nextPage);

          // Update selected options cache with new options
          newOptions.forEach((option) => {
            selectedOptionsCache.current[option.value] = option;
          });
        } else {
          // No more items
          paginationStateRef.current[cacheKey] = {
            ...state,
            hasMore: false,
          };
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading more options:", err);
        paginationStateRef.current[cacheKey] = {
          ...state,
          hasMore: false,
        };
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [api, pageSize, searchKey, transformOptions, isLoading]
  );

  /**
   * Custom styles for react-select with tag display
   */
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: hasError
        ? "#dc3545"
        : state.isFocused
        ? "#86b7fe"
        : "#dee2e6",
      boxShadow: hasError
        ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
        : state.isFocused
        ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
        : "none",
      "&:hover": {
        borderColor: hasError ? "#dc3545" : "#86b7fe",
      },
      minHeight: "38px",
      padding: "2px 4px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "300px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(255, 159, 67, 0.1)",
      borderRadius: "4px",
      border: "1px solid rgba(255, 159, 67, 0.3)",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#ff9f43",
      fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#ff9f43",
      ":hover": {
        backgroundColor: "rgba(255, 159, 67, 0.2)",
        color: "#e6892a",
      },
    }),
  };

  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={selectId} className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required.` : false,
        }}
        render={({ field }) => {
          // Get selected options based on field value (array of IDs)
          const selectedValues = Array.isArray(field.value) ? field.value : [];

          // Find selected options from allOptions, cache, or create placeholder options
          const selectedOptions = selectedValues.map((value) => {
            // First check allOptions (current search results)
            const found = allOptions.find((option) => option.value === value);
            if (found) {
              return found;
            }
            // Then check cache (preserves labels from previous searches)
            const cached = selectedOptionsCache.current[value];
            if (cached) {
              return cached;
            }
            // Create a placeholder option as last resort
            return {
              label: String(value),
              value: value,
              data: { _id: value },
            };
          });

          return (
            <AsyncSelect
              {...field}
              id={selectId}
              instanceId={selectId}
              loadOptions={loadOptions}
              defaultOptions={true}
              cacheOptions={true}
              isClearable
              isSearchable
              isMulti
              placeholder={defaultPlaceholder}
              aria-label={selectAriaLabel}
              aria-required={required}
              aria-invalid={hasError}
              styles={customStyles}
              classNamePrefix="react-select"
              className={hasError ? "is-invalid" : ""}
              onChange={(selected) => {
                if (selected && selected.length > 0) {
                  // Store selected options in cache to preserve labels
                  selected.forEach((option) => {
                    selectedOptionsCache.current[option.value] = option;
                  });
                }
                // Convert selected options array to array of values
                const values = selected
                  ? selected.map((item) => item.value)
                  : [];
                field.onChange(values);
              }}
              value={selectedOptions}
              components={{
                MenuList: (props) => (
                  <MenuList
                    {...props}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    currentSearch={currentSearch}
                  />
                ),
                MultiValue: MultiValue,
              }}
              formatOptionLabel={formatOptionLabel}
              getOptionValue={getOptionValue || ((option) => option.value)}
              getOptionLabel={getOptionLabel || ((option) => option.label)}
              noOptionsMessage={({ inputValue }) =>
                inputValue
                  ? `No options found for "${inputValue}"`
                  : "No options available"
              }
              {...rest}
            />
          );
        }}
      />
      {hasError && (
        <p
          id={`${selectId}-error`}
          className="text-danger mt-1 mb-0 small"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

AsyncMultiSelectPagination.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  api: PropTypes.func.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  pageSize: PropTypes.number,
  searchKey: PropTypes.string,
  formatOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  getOptionLabel: PropTypes.func,
};

AsyncMultiSelectPagination.defaultProps = {
  required: false,
  className: "",
  placeholder: "Select...",
  pageSize: 50,
  searchKey: "search",
  formatOptionLabel: undefined,
  getOptionValue: undefined,
  getOptionLabel: undefined,
};

export default AsyncMultiSelectPagination;
