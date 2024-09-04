import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";


export default function MenuComponent({ onButtonClick }) {



  const handleCloseMenu = () => {
    onButtonClick();
  };


  return (
    <>
      <Card
        style={{
          backgroundColor: "white",
          color: "black",
          height: '70vh',
        }}
      >
        <CardContent className="waletGrid">
          <>
            <TabContext value={"1"}>
              <>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <TabList aria-label="lab API tabs example">
                      <Tab
                        label="MENU"
                        value="1"
                        style={{
                          color: "black",
                        }}
                      />
                    </TabList>
                  </Box>
                  <Box>
                    <CloseTwoToneIcon
                      style={{
                        marginTop: "10px",
                      }}
                      onClick={handleCloseMenu}
                    />
                  </Box>
                </Box>
              </>

              <TabPanel value="1">
                <>
                  <h1>Menu</h1>
                </>
              </TabPanel>
            </TabContext>
          </>
        </CardContent>
      </Card>
    </>
  );
}
