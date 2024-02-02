import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import styles from "./prediction.module.css";
import { THEME_CONTENT } from "../../theme/theme";
import TextField from "@mui/material/TextField";
import DropZone from "react-dropzone";
import upload_img from "./upload.png";
import zip_rar_logo from "./zip_rar_logo.jpg";
import { Button } from "antd";
import set_notification from "../../components/notification/notification";

/**
 * @description
 * @author MaoZane
 * @export
 * @class Prediction
 * @extends {Component}
 */
export default class Prediction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_imageBase64: [],
      list_imageName: [],
      a: 111,
      uploadType: "image",
      file_uploaded: false,
      file_uploaded_type: "",
      file_name: "",
      file_size: "",
      file: null,
    };
  }
  submit = () => {
    if (this.state.file_uploaded_type === "image") {
      this.props.changePredictionStatus("start");
    } else {
      set_notification(
        "success",
        "Submitted successfully",
        "Please jump to History page to get the result!"
      );
    }

    let form = document.getElementById("prediction_form");
    let metadata = new FormData(form);
    let form_data = new FormData();
    for (let e of metadata) {
      form_data.append(e[0], e[1]);
    }
    form_data.append("image", this.state.file);
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let job_name = date + "_" + time;
    job_name = job_name.replaceAll(" ", "");
    job_name = job_name.replaceAll("/", "_");
    let userName=localStorage.pathway
    userName = userName.replace(/[^a-zA-Z]/g, '');
    form_data.append("user_name", userName);
    //localStorage.setItem('Bash', 'Basher');
    //form_data.append("user_name", localStorage.Bash);
    form_data.append("job_name", "Test");
    form_data.append("file_type", this.state.file_uploaded_type);
    
    //****** create head */
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "multipart/form-data");
    var requestOptions = {
      body: form_data,
      method: "POST",
      
    };
    // // ****** fetch post /predict */
    
    fetch(process.env.REACT_APP_API + "/predict", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.log("error coming from here")
          console.log(result);
          
        } else {
          //****** success */
          console.log(result);
          this.props.fn_showResult(result);
        }
      })
      .catch((error) => console.log("error", error));
  };
  onDrop = (file) => {
    console.log(file);
    if((file[0].size / 1048576).toFixed(2)<15){
      this.setState({
        file_uploaded: true,
        upload_file: file[0],
        file: file[0],
        file_name: file[0].name,
        file_size: (file[0].size / 1048576).toFixed(2),
      });
      if (file[0].type.includes("image")) {
        let image = file[0];
        let url = window.URL.createObjectURL(image);
        document.getElementById("upload_image").src = url;
        this.setState({
          file_uploaded_type: "image",
        });
      } else {
        // let url = window.URL.createObjectURL(zip_rar_logo);
        document.getElementById("upload_image").src = zip_rar_logo;
        this.setState({
          file_uploaded_type: "zip",
        });
      }
    }else{
      set_notification(
        "error",
        "upload failed",
        "file's size must less than 15MB!"
      );
    }
    
  };
  reset_figure_info = () => {
    this.setState({
      file_uploaded: false,
    });
  };
  render() {
    //style of the form input
    const MyTextField = styled(TextField)({
      "& label.Mui-focused": {
        color: THEME_CONTENT[this.props.theme].main_color,
      },
      "& label": {
        color: THEME_CONTENT[this.props.theme].color,
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: THEME_CONTENT[this.props.theme].main_color,
      },

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: THEME_CONTENT[this.props.theme].input_border_color,
        },
        "&:hover fieldset": {
          borderColor: THEME_CONTENT[this.props.theme].input_border_color_hover,
        },
        "&.Mui-focused fieldset": {
          borderColor: THEME_CONTENT[this.props.theme].main_color,
        },
        color: THEME_CONTENT[this.props.theme].color,
      },
    });
    return (
      <React.Fragment>
        <form id="prediction_form">
          <div
            className={styles.container_input}
            style={{
              backgroundColor:
                THEME_CONTENT[this.props.theme].background_color_content,
            }}
          >
            <p className={styles.title_content}>New project</p>
            <div
              style={{
                textAlign: "center",
                display: this.state.file_uploaded ? "none" : "block",
                marginTop: "20px",
              }}
            >
              <DropZone
                name="img"
                onDrop={this.onDrop}
                accept="image/*, .zip"
                multiple={false}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className={styles.file_on}>
                    <input {...getInputProps()} />
                    <img
                      src={upload_img}
                      alt="asd"
                      style={{ height: "15vw" }}
                    />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                )}
              </DropZone>
            </div>
            <div
              className={styles.file_on}
              style={{
                textAlign: "center",
                display: this.state.file_uploaded ? "block" : "none",
                marginTop: "20px",
                padding: "10px",
              }}
            >
              <img
                id="upload_image"
                alt="uploaded"
                style={{ height: "15vw", marginBottom: "10px" }}
              ></img>
              <p>
                file:"{this.state.file_name}" has been uploaded! Size:
                {this.state.file_size}MB{" "}
              </p>
              <Button
                variant="outlined"
                size="small"
                onClick={this.reset_figure_info}
              >
                Reset
              </Button>
            </div>
          </div>

          <div
            className={styles.container_input}
            style={{
              backgroundColor:
                THEME_CONTENT[this.props.theme].background_color_content,
            }}
          >
            <p className={styles.title_content}>Figure info</p>

            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item sm={6}>
                <MyTextField
                  name="figure_title"
                  id="outlined-basic"
                  label="Figure Title"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 90 }}
                />
              </Grid>
              <Grid item sm={6}>
                <MyTextField
                  name="figure_link"
                  id="outlined-basic"
                  label="Resource Link"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={12}>
                <MyTextField
                  name="figure_description"
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  inputProps={{ maxLength: 100 }}
                  minRows={2}
                />
              </Grid>
            </Grid>
            <br />
            <p className={styles.title_content}>Paper info</p>
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="paper_title"
                  id="outlined-basic"
                  label="Paper Title"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="paper_source"
                  id="outlined-basic"
                  label="Resource Link"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="pmc_id"
                  id="outlined-basic"
                  label="PMC ID"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="pm_id"
                  id="outlined-basic"
                  label="PM ID"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="first_author"
                  id="outlined-basic"
                  label="First Author"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  defaultValue={1900}
                  name="publication_year"
                  id="outlined-basic"
                  label="Publication year"
                  variant="outlined"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="journal"
                  id="outlined-basic"
                  label="Journal"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 90 }}
                />
              </Grid>
              <Grid item sm={6} md={3}>
                <MyTextField
                  name="keywords"
                  id="outlined-basic"
                  label="Keywords"
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item sm={12}>
                <MyTextField
                  name="paper_description"
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={2}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
            </Grid>
            <br />
            <Button type="reset" variant="outlined" size="small">
              Reset
            </Button>
          </div>
        </form>
        <Button onClick={this.submit} variant="contained" type="primary">
          submit
        </Button>
      </React.Fragment>
    );
  }
}
