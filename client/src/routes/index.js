import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "../components/Home";
import Layout from "../components/Layout";
import { Box } from "@mui/material";
import ViewPost from "../components/Post/ViewPost";
import { SocketProvider } from "../contexts/context";
import Loading from "../utils/Loading";
import LoadingModal from "../utils/LoadingModal";

function Routing(){
  return(
    <SocketProvider>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:{xs:"57px",sm:"65px"}}}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/post/:id" element={<ViewPost/>} />
              <Route path="/loading" element={<LoadingModal/>} />
            </Route>
          </Routes>
      </Box>
    </SocketProvider>
  );
}
export default Routing