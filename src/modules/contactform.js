import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class Pinform extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountnumber: '',
            sortcode: ''
        };
    }

    handleClick(event) {
        console.log("updating friends");
        this.props.update_friends({
            "name": this.props.contact,
            "accountnumber": this.state.accountnumber,
            "sortcode": this.state.sortcode
        },this.props.amount);
    }

    render() {
        return (
            <div className="Login">
                <div>
                    <MuiThemeProvider>
                        <div>
                            <TextField
                                type="field"
                                hintText="Enter Account Number"
                                floatingLabelText="Account Number"
                                onChange = {(event,newValue) => this.setState({accountnumber:newValue})}
                            />
                            <TextField
                                type="field"
                                hintText="Enter Sort-Code"
                                floatingLabelText="Sort Code"
                                onChange = {(event,newValue) => this.setState({sortcode:newValue})}

                            />
                            <br/>
                            <RaisedButton label="Submit" primary={true}
                                          onClick={(event) => this.handleClick(event)}/>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>);
    }
}

export default Pinform;

