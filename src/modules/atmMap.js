import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div><svg height="100" width="100">
  <circle cx="50" cy="50" r="7" stroke="black" stroke-width="2" fill="red" />
</svg></div>;

class atmMap extends Component {


    constructor(props) {
        super(props);
        this.state = {
            atms: [],
        };

        this.props.json['results'].map(loc => this.state.atms.push(loc['geometry']['location']));
    }

  static defaultProps = {
    center: {
      lat: 51.5041874,
      lng: -0.0132312
    },
    zoom: 13,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '30vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBcsc2VpLQ7TO5MTLc_Ku89o0sbvQvxidQ'}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
            {this.state.atms.map((atm) =>
                <AnyReactComponent
                    lat={atm.lat}
                    lng={atm.lng}>
                </AnyReactComponent>)
            }
        </GoogleMapReact>
      </div>
    );
  }
}

export default atmMap;