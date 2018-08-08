import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class Pinform extends Component {
    render() {
        return (
            <div className="Login">
                <div>
                    <MuiThemeProvider>
                        <div>
                            <TextField
                                type="password"
                                hintText="Enter your Pin"
                                floatingLabelText="Pin Number"
                            />
                            <br/>
                            <RaisedButton label="Submit" primary={true} onClick={(event) => this.props.confirm_payment()}/>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>);
    }
}

export default Pinform;

