import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Popover from "react-bootstrap/es/Popover";

class cashbackmap extends Component {


    constructor(props) {
        super(props);
        this.state = {
            stores: [],
        };

        this.props.json['results'].map(loc => this.state.stores.push({
            location: loc['geometry']['location'],
            name: loc['name']
        }));
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
            {this.state.stores.map((store) =>
                <Popover id="popover-basic"
                            placement="right"
                            positionTop={-70}
                            lat={store.location.lat}
                            lng={store.location.lng}>
                            <div class="popover-text">{store.name}</div>
                </Popover>)
            }
        </GoogleMapReact>
      </div>
    );
  }
}

export default cashbackmap;