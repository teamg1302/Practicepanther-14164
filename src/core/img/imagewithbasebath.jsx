import React from "react";
import PropTypes from "prop-types";
import { image_path } from "@/environment";

/**
 * Lightweight helper that prefixes the configured image base path.
 */
const ImageWithBasePath = (props) => {
  const altText = String(props.alt ?? "");
  const fullSrc = `${image_path}${props.src}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={altText}
      width={props.width}
      id={props.id}
    />
  );
};

ImageWithBasePath.propTypes = {
  alt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ImageWithBasePath;
