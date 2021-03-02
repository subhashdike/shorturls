import React from "react";
import { Card, CardContent, TextField, Button } from "@material-ui/core";
import isURL from "validator/es/lib/isURL";
import axios from "axios";
import FeedBack from "./Feedback";
import AlertDialog from "./AlertDialog";

interface IProps {}
interface IResponse {
  slug: string;
}

interface IState {
  url: string;
  slug: string;
  showSnackBar: boolean;
  error?: any;
  validationError: boolean;
}

export default class Generator extends React.Component<IProps, IState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      url: "",
      slug: "",
      showSnackBar: false,
      validationError: false,
    };
  }

  handleChange(e: { target: { value: any } }) {
    this.setState({ url: e.target.value });
  }

  postUrl(event: React.FormEvent) {
    event.preventDefault();
    if (
      isURL(this.state.url.trim(), {
        protocols: ["http", "https", "ftp"],
        require_protocol: true,
        require_host: true,
        require_tld: false, //Support localhost
        require_valid_protocol: true,
      })
    ) {
      this.setState({ validationError: false });
      axios
        .post<IResponse>(`${process.env.REACT_APP_BACKENDURL}/api/v1/shorten`, {
          url: this.state.url,
        })
        .then((response) => {
          this.setState({ slug: `${window.location}${response.data.slug}` });
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
          this.setState({ error: errorMessage});
        });
    } else {
      this.setState({ validationError: true });
    }
  }

  copyToCliboard() {}

  render() {
    return (
      <Card variant="outlined">
        <CardContent>
          <form
            autoComplete="off"
            onSubmit={(e) => {
              this.postUrl(e);
            }}
          >
            <div>
              <TextField
                autoFocus
                required
                fullWidth
                id="outlined-basic"
                label="Full Url"
                variant="standard"
                value={this.state.url}
                onChange={this.handleChange}
                helperText={
                  this.state.validationError
                    ? "The entered value has to be a valid URL"
                    : null
                }
                error={this.state.validationError}
              />
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{
                  margin: "10px 0 10px 0",
                }}
                type="submit"
              >
                Shorten
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.setState({ slug: "", url: "", validationError: false });
                }}
                style={{
                  margin: "10px 0 10px 10px",
                }}
              >
                Clear
              </Button>
            </div>
          </form>
          <FeedBack slug={this.state.slug}></FeedBack>
        </CardContent>
        {this.state.error && (
          <AlertDialog
            errorMessage={this.state.error}
            onDismissed={() => {
              this.setState({ error: null });
            }}
          ></AlertDialog>
        )}
      </Card>
    );
  }
}
