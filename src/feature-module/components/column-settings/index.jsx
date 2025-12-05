import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { ViewColumn } from "@mui/icons-material";

const ColumnSettings = ({ table }) => {
  const [anchor, setAnchor] = React.useState(null);

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
        <ViewColumn />
      </IconButton>

      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
      >
        {table.getAllLeafColumns().map((col) => (
          <MenuItem key={col.id} onClick={() => col.toggleVisibility()}>
            <input
              type="checkbox"
              checked={col.getIsVisible()}
              readOnly
              style={{ marginRight: 8 }}
            />
            {col.columnDef.header}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ColumnSettings;
