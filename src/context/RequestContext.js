import { useContext } from "react";
import { RequestContext } from "../providers/RequestDataProvider";

const useRequestContext = () => useContext(RequestContext);

export { RequestContext, useRequestContext };
