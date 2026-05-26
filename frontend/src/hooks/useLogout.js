import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../context/TokenContext";
import TaskContext from "../context/TaskContext";

export default function useLogout() {
  const { tokenDispatch, userDispatch } = useContext(TokenContext);
  const { dispatch: taskDispatch } = useContext(TaskContext);
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("authToken");
    tokenDispatch({ type: "UNSET_TOKEN" });
    userDispatch({ type: "UNSET_USER" });
    taskDispatch({ type: "SET_TASK", payload: [] });
    navigate("/login", { replace: true });
  };
}
