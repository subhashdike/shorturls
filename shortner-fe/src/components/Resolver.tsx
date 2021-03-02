import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import AlertDialog from "./AlertDialog";

interface IParams {
  slug: string;
}

interface IResponse {
  fullUrl: string;
}

interface IState {
  errorMessage: string;
  errorDisplayed: boolean;
}

export default function Resolver() {
  const [state, setState] = useState<IState>({
    errorMessage: "",
    errorDisplayed: false,
  });
  const { slug } = useParams<IParams>();
  useEffect(() => {
    axios
      .get<IResponse>(`${process.env.REACT_APP_BACKENDURL}/api/v1/full/${slug}`)
      .then((response) => {
        window.location.replace(response.data.fullUrl);
      })
      .catch((error) => {
        let errorMessage = "There was an error processing your request.";
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `${error.response.data.message}`;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errorMessage = `The request could not be completed`;
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `${error.message}`;
        }
        setState({ errorMessage, errorDisplayed: false });
      });
  },[slug]);
  return (
    <div>
      {!state?.errorDisplayed && !state?.errorMessage && <LinearProgress />}
      {state.errorDisplayed && <Redirect to="/" />}
      {state?.errorMessage && (
        <AlertDialog
          errorMessage={state.errorMessage}
          onDismissed={() => {
            setState({ errorMessage: "", errorDisplayed: true });
          }}
        ></AlertDialog>
      )}
    </div>
  );
}
