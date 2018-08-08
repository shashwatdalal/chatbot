import React, {Component} from 'react';
import {Widget, addResponseMessage, addLinkSnippet, renderCustomComponent} from 'react-chat-widget';
import logo from '../static/jibu.PNG';
import '../static/App.css';
import {Wit, log} from 'node-wit';
import 'react-chat-widget/lib/styles.css';
import Pinform from "./pinform";
import contactform from "./contactform";
import SimpleMap from "./SimpleMap";
import atmMap from "./atmMap";

const client = new Wit({
    accessToken: 'QYBTUE5UDAXN4YIDX46MAITEVQP4PLRS',
    logger: new log.Logger(log.DEBUG) // optional
});

const redirect_urls = {
    "open_account": "https://www.barclays.co.uk/current-accounts/",
    "transfer": "https://bank.barclays.co.uk/olb/authlogin/loginAppContainer.do#/identification"
};

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            myLocation: ""
        };
        addResponseMessage("What can Jibu do for you :)")
    }

    update_friends(friend, amount) {
        console.log(friend);
        this.state.friends.push(friend);
        addResponseMessage("I shall remember " + friend.name);
        addResponseMessage("Add pin to confirm sending " + amount + " to " + friend.name);
        renderCustomComponent(Pinform, {'confirm_payment': this.confirm_payment.bind(this)});
    }

    confirm_payment() {
        addResponseMessage("payment made!");
    }

    handleNewUserMessage = (newMessage) => {
        client.message(newMessage)
            .then((resp) => {
                try {
                    let intent = resp['entities']['intent'][0].value;

                    if (redirect_urls[intent] !== undefined) {
                        if (intent == "transfer") {
                            try {
                                let amount = resp['entities']['amount_of_money'][0]['value'];
                                let contact = resp['entities']['contact'][0]['value'];
                                if (this.state.friends.filter(f => f.name == contact).length !== 0) {
                                    //friend exists
                                    addResponseMessage("Transferring " + amount + " to " + contact);
                                    renderCustomComponent(Pinform);
                                    addResponseMessage("Please enter your Pin");
                                } else {
                                    //friend does not exist
                                    addResponseMessage("I'm sorry I don't know who " + contact + " is");
                                    addResponseMessage("Can you add " + contact + "'s bank details?");
                                    const props = {
                                        'contact': contact,
                                        'amount': amount,
                                        'update_friends': this.update_friends.bind(this)
                                    };
                                    renderCustomComponent(contactform, props, true);

                                }
                            } catch (e) {
                                addResponseMessage("I'm sorry, I'm unable to process your payment");
                            }
                        }

                    } else if (intent === "nearest_atm") {
                        addResponseMessage("I've found 14 ATMs near you");
                        renderCustomComponent(atmMap, {json: {
   "html_attributions" : [],
   "next_page_token" : "CpQCBgEAANpvJTxq3nJ5ANk26UfA67a54OIHZl4VqAJLUtYUdKEFawa6zU35ZpIT9rC6ImGEz1Gx0dZEuGnZMe1phAYkqHcVNQKaLNlBQEVWOhBBC7-De_JSTr9_5ivcuawelVAee4JG5NrLup74ywvP9apdg1eSjb1mYpjXyUforiLFu6qJCCbPuVZlaaoKmq8a7ViTGHD0hHRdCE9LliOWhJqFD0YOncwqga6FQ_WKV2hkYqkib4vyKc_JEy8QWwz-vkht6PoGybRdmJjsNjtnhQkZI2iIfX8HpKJQ0BZ-81hE0Vd24rOJcxRMhViUAARhvLGFdxae8NMqCUvEHOmCbXyw8Q6WO60nKajGLcZAa38oiT3PEhA0IkADMNTugGdoA58PlwggGhTv21XVUbc941KldOp_cxpAC8wYjQ",
   "results" : [
      {
         "formatted_address" : "1 Canada Square, Canary Wharf, London E14 5AX, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5047136,
               "lng" : -0.0190899
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50604167989272,
                  "lng" : -0.01752622010727778
               },
               "southwest" : {
                  "lat" : 51.50334202010728,
                  "lng" : -0.02022587989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "4d2baab4790011c489268f400a67aca8b1bc2768",
         "name" : "ATM",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3264,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/104713535797621577675/photos\"\u003eMichael Hallett\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAaO5cws6U7D6G-oH8niraD3HO3wI-dNs_urZObWCX5HVjzufSRpPyZVZbwrSEyebu-UfvDBZ3-mTRYv0GRTapnOz7cpyMazdHSKQ47-_65t8toY_lBn-TWCFp39Z1dHMiEhCU92xq2pOLs3DA9mzjvyYHGhSxzWs-mJ1pPZK2kUSgBzh8jAJXXA",
               "width" : 2448
            }
         ],
         "place_id" : "ChIJz7lbQ7cCdkgRrvSYQGRn3Ao",
         "plus_code" : {
            "compound_code" : "GX3J+V9 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+V9"
         },
         "rating" : 3.5,
         "reference" : "CmRbAAAAXYM5nwW5CWhdcimYV8d1SMcH-5nw-Qz01TZiVSLGr5vkpAnSvnMGDffzero39aqLT_v6CkJ_ZIg_Begr_fXE5g_A4PuCXzqjWDGcvBHWaK1vV4iuQnkgTrS_litpt2iyEhDBWGpixqoV5gnWIs8_PF2eGhTqc_pL3omQBdwXUqZMhKWoHbFEZA",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "10 Upper Bank St, Canary Wharf, London E14 2BB, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5025612,
               "lng" : -0.0169059
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50402007989273,
                  "lng" : -0.01589572010727779
               },
               "southwest" : {
                  "lat" : 51.50132042010728,
                  "lng" : -0.01859537989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "1ebe034eda021932c0d53d36328c8e990ec7a0c5",
         "name" : "Barclays ATM",
         "opening_hours" : {
            "open_now" : true
         },
         "place_id" : "ChIJbR5dVKkCdkgRius397LEr6Y",
         "plus_code" : {
            "compound_code" : "GX3M+26 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3M+26"
         },
         "rating" : 3.5,
         "reference" : "CmRbAAAA3iipC9osCkpSDMKZ6C6OhOod3xnHUPb2nlTSfCUmmgeRtP3aPKjE-cBERNJDXJdyJmLL1ccoHgUvgb7coXKRmlatweIoAZ-Zh4tONHvlOVqxANyCQ5TflgkSh6zIEU-IEhB4-5YtnvjZnycyv0EOr7lNGhQyzCd4eJmklpEKNCGVGjHgNh4zDQ",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "18 Hertsmere Rd, Canary Wharf, London E14 4AY, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5078042,
               "lng" : -0.0225962
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50912297989272,
                  "lng" : -0.02125497010727779
               },
               "southwest" : {
                  "lat" : 51.50642332010727,
                  "lng" : -0.02395462989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "6259ec8012a1c9d98a76a67c038486da58b5258b",
         "name" : "ATM",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2448,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/104713535797621577675/photos\"\u003eMichael Hallett\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAABOTOao1_XwsjKHYRTrMSupPjvMxhi7WyudVAvBETRp4zc5eJ8tE3KIp_IexeGSSlRUjQW4L-4JQMbrZti3907XXPJ06gwyGGton9a8oUPb3aNktXTKuUY3Q3Yz-EZdHQEhCxAjtSJLJ6i2y33-K5FKtsGhQHV592pWWqoo20aESg8uasSJG6-Q",
               "width" : 3264
            }
         ],
         "place_id" : "ChIJ6QtvMLYCdkgR6LNs-KDOl9I",
         "plus_code" : {
            "compound_code" : "GX5G+4X Canary Wharf, London, UK",
            "global_code" : "9C3XGX5G+4X"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAip6lgm4GUifUHw-54j8AoSJ5bhGfD6tR4f5APURC_IMAVUJtKj422PTFyLB46w1xIdRd6qgwivTt4eXI7cnSd9Cfw1X1KbOmkJDdXUrYZ1IWJLAbd7O-h1B8euWEP0fJEhATFc_pxDzDs7JEuu5sqz1LGhRz62Z08yK3x8rk5157vK3iGxAZxw",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Citigroup Centre, 33 Canada Square, Canary Wharf, London E14 5LB, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5042407,
               "lng" : -0.0181384
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50569607989272,
                  "lng" : -0.01675787010727778
               },
               "southwest" : {
                  "lat" : 51.50299642010728,
                  "lng" : -0.01945752989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png",
         "id" : "83ff05842dbdf747da9b2a57c8ff4b8e97b2c61a",
         "name" : "Citibank UK",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 1190,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/117744541095508819557/photos\"\u003eStephen Abraham\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAb0ba3dPMkfdnPsJuKaNV_rEtpp4jDbbiepN53GluhG6MQeq9LZXeX0MBiUZ8siv1FfFgx7ZFCHE8sfi1cWXqQAjXR9KzNdgvZLThY4BsOYBSORIExFEVqjWlozGP__BGEhCC8TsijQ-rEwh0H_2_sHAkGhSDTXXHmByHsor1Y-cfSYtJHtfmYQ",
               "width" : 1587
            }
         ],
         "place_id" : "ChIJiehb-7kCdkgRiLVZERmmd7k",
         "plus_code" : {
            "compound_code" : "GX3J+MP Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+MP"
         },
         "rating" : 3,
         "reference" : "CmRbAAAAdtkiKnpvvP8XhVxIgv1Z45KVkaxAZBnLZ9j9I-YrwmeKoPb9vlfNot7sHQgf6bFxfq-AbXFR4DCY6RaRclT9mdxxSuG4FgUEHfg7R3KKu6rUvEmzYJMAqBh5nmeycBmwEhAjuMtaVjnk_9GHiL-F17cFGhRseETV_kc134_DFX4zh8Lcvi9TNw",
         "types" : [ "bank", "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "25 Bank St, Canary Wharf, London E14 5NT, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5042813,
               "lng" : -0.0181821
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50508952989271,
                  "lng" : -0.01719502010727778
               },
               "southwest" : {
                  "lat" : 51.50238987010727,
                  "lng" : -0.01989467989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "51fce068d5d74e899936d999856729fe34d4b829",
         "name" : "ATM",
         "place_id" : "ChIJe1MIhbkCdkgR_5vKIgdnpME",
         "plus_code" : {
            "compound_code" : "GX3J+PP Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+PP"
         },
         "rating" : 5,
         "reference" : "CmRbAAAAgY5zQ3cAyhwKatLKnbLOXVKOp9OK3P1ss-yKzXUboF-ZB7Wwgu5SpqeNEbR0PZJaXdqRFZYYdAwRP35elW7WBvLr5yJyKtQ-Vr2DxFLOKkvg8a1OnycC0es_vw4bVUohEhCpvxqxAaPT867d11gBpTBRGhRgJveLLz_XOqCiIdbgb8TtXkk-eA",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Hertsmere Rd, Canary Wharf, London E14 4AE, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.50768290000001,
               "lng" : -0.024053
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50914017989272,
                  "lng" : -0.02264997010727778
               },
               "southwest" : {
                  "lat" : 51.50644052010728,
                  "lng" : -0.02534962989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "c88284cbaf6488e04b7e7c810085c4e0239eb1c5",
         "name" : "Hsbc",
         "opening_hours" : {},
         "photos" : [
            {
               "height" : 4160,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/107706896842853954229/photos\"\u003eChris Pressley\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAXG4pbP0vbZ3EJWLa5h3upBFHax3EjftpbGVZpmpvqIM-iAh7c1WK6WKtEmiQf3Azt5iPuP7svKMMfiylNjBSoIMYS9OiXXGZY49WA3y_4buaNy-69bI4R1ou84xgHHS8EhDMdfQI0CtG0zeNIpPxiKuxGhS0Tbem5hEZgPXTEDGys0DiYnKmHA",
               "width" : 2340
            }
         ],
         "place_id" : "ChIJw89c0MkCdkgRGUYS_2Lcc6E",
         "plus_code" : {
            "compound_code" : "GX5G+39 Canary Wharf, London, UK",
            "global_code" : "9C3XGX5G+39"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAK_SlNPaIpn5cLmM7YQGp5rsnpfTsfrqsbWbOvAQaBSBqT2sm8TmWXt4VRY-yFbm67Wk74I3DPEAf4MsYBxwTfdaHnMM7qwH6gZb6sCPROwmb4WtaEJdMpUrHqOyChXUsEhDrZ3VDAN_REiTq5ffnZ03tGhRqvK79Cn0x3bcBcyv7Rf8KkZSO1A",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Mall -1, 38 Canada Square, London E14 5AH, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.5048934,
               "lng" : -0.0194238
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50620257989272,
                  "lng" : -0.01767452010727779
               },
               "southwest" : {
                  "lat" : 51.50350292010727,
                  "lng" : -0.02037417989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "9125cee84f11390c7893071608fd9d1f4461ed00",
         "name" : "HSBC",
         "opening_hours" : {
            "open_now" : true
         },
         "place_id" : "ChIJmdDxw18DdkgRgi1H-oPlHZk",
         "plus_code" : {
            "compound_code" : "GX3J+X6 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+X6"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAbjkEiyI38vJe_P5SB0Ve4TSULfkruZl9fmIK3T1It3FUsJAOfXqc157tMdN83Kycj8raGK6ZzmO_SXZ2eWCgzrOFd7EG97RdWKgvMZPn7PxX7cHimyhvW04FsRXHqaPWEhCHEbCJKg-r-k7XJsOCrO-FGhQGJ4iDqwhIVAVEkTXgtY6WWRqR3w",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "54 Marsh Wall, London, West India Dock E14 9TP, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.5008537,
               "lng" : -0.0220342
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50220352989272,
                  "lng" : -0.02068437010727778
               },
               "southwest" : {
                  "lat" : 51.49950387010728,
                  "lng" : -0.02338402989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "bf735b1159f4a1ddf30fe988ef01e7b6fa7ab261",
         "name" : "ATM",
         "place_id" : "ChIJPYxMnbgCdkgRmryKhfurE5M",
         "plus_code" : {
            "compound_code" : "GX2H+85 Isle of Dogs, London, UK",
            "global_code" : "9C3XGX2H+85"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAIJj6umpaga2vjkl6le0GpVgzgJPNLrCuCgPaGyXKTVwCDsc65kDERKcdjrTMdDok5aggRX6M0KVwKX6s-BTnoLXP6thdQugHHCKsE2uOdRSMIkPYmnTH1kaRefkj1N7JEhAhlZMjpbL01l2jcENucpdDGhRDRHklNuJi3XtJvavagC5bAK9WVw",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "53 Poplar High St, Poplar, London E14 0DA, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.50918919999999,
               "lng" : -0.0191172
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.51054067989272,
                  "lng" : -0.01776667010727779
               },
               "southwest" : {
                  "lat" : 51.50784102010728,
                  "lng" : -0.02046632989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "c34b05afa5e1db9571f6f06e095bd7634f933ad7",
         "name" : "ATM",
         "opening_hours" : {
            "open_now" : true
         },
         "place_id" : "ChIJCbRtmLYCdkgRYWSWBlD4xbY",
         "plus_code" : {
            "compound_code" : "GX5J+M9 Canary Wharf, London, UK",
            "global_code" : "9C3XGX5J+M9"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAnfLA9TFpRJoVn8YzzASmzkBO8b4W14RfiMJ6PRPMx4MNCE2w2tNccBEfnPM0eP9EDHjTMh1o6WERcnx1XnYGr4lTRM7zlsMpss-5bYJm4ULHV5FwIaOwkVHwGHLeE7QPEhAXQJKHUGol90vXMMVe1BMrGhTBTYzFYhnx7WWQnnhqfJTTccsSqA",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "2, Cabot Place, 1 Canada Square, Canary Wharf, London E14 5AB, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5051816,
               "lng" : -0.0196034
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50653142989272,
                  "lng" : -0.01825357010727778
               },
               "southwest" : {
                  "lat" : 51.50383177010728,
                  "lng" : -0.02095322989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png",
         "id" : "32d6256787a059a5af951e8ef25f504ab5008710",
         "name" : "Santander Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2988,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100530180329228199403/photos\"\u003eAmirhossein Zohrevand\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAgs2e-XSdyLsvxruHpbsfHh6UykBSggTRpGxeNlzIieAtyVh4uhPEtLkIrwRQvCrhfymUVXxZ0XqTym-8SUcWUElZ4l5E9nLbI-RRIUdGKnPWBuvGbEnMdvR8JLL0XOJREhBKe4zh3Fiwm9x_oXX04gVCGhQ2wfWrWjDjgGMP9WseNmkanpq5lg",
               "width" : 5312
            }
         ],
         "place_id" : "ChIJnS8vZLcCdkgRvUwjf6OY-8c",
         "plus_code" : {
            "compound_code" : "GX4J+35 Canary Wharf, London, UK",
            "global_code" : "9C3XGX4J+35"
         },
         "rating" : 2.7,
         "reference" : "CmRbAAAAloeY-q_s1hczlN1qVmlLFBOyV_crYoR4rRQczGCQYDXUFj4omLHZywJphxQ43MU7sfJxuCQWYEBIZ2a5Wu_tp1ItoSqtB9qLB-h3Ae5ToqtsFVp0ZYklL0T4-FypP-YkEhCiogyQ8KzT5Llccx87wfL7GhTyA6UPDV9jKWbb6lHFf7JjFwzDNg",
         "types" : [ "bank", "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "45 W India Dock Rd, Poplar, London E14 8HN, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5098938,
               "lng" : -0.0253683
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.51124362989272,
                  "lng" : -0.02401847010727778
               },
               "southwest" : {
                  "lat" : 51.50854397010728,
                  "lng" : -0.02671812989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "e752c542d252cb1bda481d256eaad7884d50ad89",
         "name" : "ATM",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 4032,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/111030982266074501877/photos\"\u003eAli D\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAALD5k3cE8deSt8ePM0jraUEF-51GgxoYYc66W_GNCon-_WLxeh8P0g_Qzmft7r5VZnUaBXxKP2Eoxye09TNxoeZ3FwsGSBwTk_C78viaw5zEUaltcZ9gq7n3srWC8MOehEhDjFG_YsCREQpE7A_gHFfa4GhTjDqtv7QY88Y2YJRpeZrDLOU_zUw",
               "width" : 2268
            }
         ],
         "place_id" : "ChIJv1shJ8oCdkgR_TeZ5Jhg_Gk",
         "plus_code" : {
            "compound_code" : "GX5F+XV Canary Wharf, London, UK",
            "global_code" : "9C3XGX5F+XV"
         },
         "rating" : 1,
         "reference" : "CmRbAAAA7YhBU_b56zShZHPV73hoQuxvch-imenKWWt_vI2i3Vw0x91n2HTgP7dKL8UnKURPd3Y9AgWgRdFZ-2KczOyu8qPK0GJ1WSKyku2tR2LGV_YkWcaMPge1WDggV_qH1rG6EhCNE_p2hg9F9q226lXjeaGyGhQTJhNIfz07SA-yzOA9I5PMGEcaWQ",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Cabot Place East, Canary Wharf, 5 Chancellor Passage, Canary Wharf, London E14 4PA, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5044599,
               "lng" : -0.0209487
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50597352989273,
                  "lng" : -0.01966327010727779
               },
               "southwest" : {
                  "lat" : 51.50327387010728,
                  "lng" : -0.02236292989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/post_office-71.png",
         "id" : "d7be1d70dcaf9e9b6f1c86b997bc42b42b60f0e1",
         "name" : "Canary Wharf Post Office",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 1456,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/101500084456368422143/photos\"\u003eGurinder Chhabra\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAJzInhCWofXrP3JRU3fcCeRYBIeGNsans6h_u9dR4Uobxx0SnVjYTSKD4aDgX8jjdaUdQ3hZ9KCNup7ae5E8NDiYK9vJZI0VLWAie7wZLJOxh4LdTVVefwaP2Ym-2BuJxEhCkpwaVOK4kl5ipXAEK5OFcGhTNQgj0kTYpwRvft2xZFDJTXyGORQ",
               "width" : 2592
            }
         ],
         "place_id" : "ChIJgXAAKrgCdkgRdinMfUmQMFo",
         "plus_code" : {
            "compound_code" : "GX3H+QJ Canary Wharf, London, UK",
            "global_code" : "9C3XGX3H+QJ"
         },
         "rating" : 2.3,
         "reference" : "CmRbAAAACsZJ_4tTtYRn6n6lYGKlVKYkp5bXIye-X886wd0TrxAbNKtP7o8e0aPcip-oiL8NVUuTTwFHtA-njP82KEo3jRH8D_2K5U-UqWS5EnJJUeZ0BBZi_fyOpWnGqN_3udbWEhC0sDXFTPpkeD8q08Se8XxzGhRy8Ipi6S60R_8Jud9kkiXZf_4cEQ",
         "types" : [
            "post_office",
            "atm",
            "local_government_office",
            "finance",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "45 Bank St, Canary Wharf, London E14 5NY, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.503044,
               "lng" : -0.0181372
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50439382989273,
                  "lng" : -0.01678737010727778
               },
               "southwest" : {
                  "lat" : 51.50169417010728,
                  "lng" : -0.01948702989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png",
         "id" : "53b54603fe80263d2f7680dbd7671b99189e4fe3",
         "name" : "HSBC",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3024,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/116115325546151090517/photos\"\u003eJames Williams\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAAU_Zd_dbO9r79WsenYnz8UOR0PL31OKsA2J9fOzerhASGbeQLSCVgswMk3BWN3wcObp3CwiYMH_9QMaU24yo4ehDqHMBmtGX1wTrz9qG7sdlhXJcI8CzLbz_KWDKFYYyEhDTSqd9QcltKCI5AJXqojzQGhQrqLwncVK7O51TiX6TaGZqO6YCkg",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJo8vXjbkCdkgRxNoqSK7P254",
         "plus_code" : {
            "compound_code" : "GX3J+6P Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+6P"
         },
         "rating" : 2.6,
         "reference" : "CmRbAAAAoarMWYaj0qmgeRX93ykSUo-DMhw4RfbB-J-18lyILfLna_4g-DmSuY8xxx-tqdyM_OaMHuA9cq04OvCytVCBujgkSnAzzddBQf6U75-p1RicyRelk36s99O5nbKdXGJEEhBXpNaKltxKAy2b4oejkyo2GhRgQGlhoRZzFed8lYHuRMjx8Bm8BA",
         "types" : [ "bank", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "5 Saltwell St, Poplar, London E14 0DQ, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5104208,
               "lng" : -0.0209818
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.51173672989272,
                  "lng" : -0.01963192010727778
               },
               "southwest" : {
                  "lat" : 51.50903707010728,
                  "lng" : -0.02233157989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "1bc560e2fe0795d5e79655402059a134ee391ca0",
         "name" : "ATM (JTA Convinience Store)",
         "opening_hours" : {
            "open_now" : true
         },
         "place_id" : "ChIJ74Cr1LUCdkgRUZeBqGKbsPY",
         "plus_code" : {
            "compound_code" : "GX6H+5J Canary Wharf, London, UK",
            "global_code" : "9C3XGX6H+5J"
         },
         "rating" : 1,
         "reference" : "CmRbAAAATMwtEitsg8DS6gDDhJyRfFJubI3_p_IZEWJcGtVIxLSSGa2q8OZXGI4YUDQtBCt4BXQ4wIyAQkA6o6kW6iguGJD6O9Qc6LtauqWMGdENT3lfmhHY8Y-ONJkPg56lKJtcEhBnFAB5EuUzN049BdVvirTVGhTputeJkK1xUIkdPT9yxTs6zp8Isw",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "South Quay Plaza, 185 Marsh Wall, London E14 9SH, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.5004699,
               "lng" : -0.0173163
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50173437989272,
                  "lng" : -0.01598747010727778
               },
               "southwest" : {
                  "lat" : 51.49903472010728,
                  "lng" : -0.01868712989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "68ced072f96ad97b049dee0a5dd8d1a058b77f05",
         "name" : "ATM",
         "opening_hours" : {
            "open_now" : true
         },
         "place_id" : "ChIJ1cbU6LsCdkgRLJ18foeOvtg",
         "plus_code" : {
            "compound_code" : "GX2M+53 Isle of Dogs, London, UK",
            "global_code" : "9C3XGX2M+53"
         },
         "rating" : 5,
         "reference" : "CmRbAAAAXHGiqQFqNuTb5EPRbVAnOmsw0He-ULhOMqw5GwSsicfdGEHRT3Io_NgFJ5CRpR5mIqlug65BlB_ZB8o0VWcSGAK1hRQ1MtyTmwIlpDJK9mvpDUGFbltVnCmBM9Z4AWxFEhB7zqXnf6jABQqZkLdoXqB0GhS1PjiYGrPDfoao8FqkVBKW_pPY9w",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Harbour Quay, London E14 9LZ, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5017486,
               "lng" : -0.0098537
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50305317989272,
                  "lng" : -0.008517770107277783
               },
               "southwest" : {
                  "lat" : 51.50035352010728,
                  "lng" : -0.01121742989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "b70e8d1ededebf16d5bcb774379d70bc83204ff2",
         "name" : "HSBC",
         "opening_hours" : {},
         "place_id" : "ChIJb2ol4qQCdkgRHHMjAVZwA5s",
         "plus_code" : {
            "compound_code" : "GX2R+M3 Isle of Dogs, London, UK",
            "global_code" : "9C3XGX2R+M3"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAFYlts1g04zoogPa0DbXXU7AoSzOfWByGP3EpRYjpptoLTOYaG6YreDlksZUJbXKQ3qP-wGv1t7hUpeMjtsYRzvTiBrut6SrJNPcxtB0Y04imIe8P9Grr7hQl46LSlCnWEhAIYFF3_fRCpjgBURHkimBMGhRuFwSzPmOykAUHGF4cAj4AXToD3A",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Frances Wharf, Burdett Road, London E14 7BY, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.5145813,
               "lng" : -0.0281421
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.51593112989273,
                  "lng" : -0.0267922701072778
               },
               "southwest" : {
                  "lat" : 51.51323147010729,
                  "lng" : -0.02949192989272223
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "842019ba73a889d14c3fa896bbc03b80eabfc80c",
         "name" : "ATM",
         "opening_hours" : {},
         "place_id" : "ChIJ3ayHTMsCdkgRZBNl9iCQ-Zs",
         "plus_code" : {
            "compound_code" : "GX7C+RP Limehouse, London, UK",
            "global_code" : "9C3XGX7C+RP"
         },
         "rating" : 1,
         "reference" : "CmRbAAAA8bnb-06pTsW4OB1X0e76HBTTtIGi2Hx4SN2cyutXTJS2rCtgnolJfiUl440LkppCUEckZmHCiAQ8fG15Eqp54-8KnEKO62sVzfv7oi4gGcdADDrdgX_9UsknKSOq3rJ9EhDoS2S4TNb6yU7YCbSAfUhTGhT3mrlgE7LUvqQxhLGqqIf_2VCpAA",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Marsh Wall, Isle of Dogs, London E14 9SG, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.49992770000001,
               "lng" : -0.0136626
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50125717989273,
                  "lng" : -0.01231887010727778
               },
               "southwest" : {
                  "lat" : 51.49855752010728,
                  "lng" : -0.01501852989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "425d0b67d44a18be99a8a6bc9e7c1921422aac73",
         "name" : "HSBC ATM",
         "opening_hours" : {},
         "place_id" : "ChIJUVZmb7sCdkgRi5GT5BMupRg",
         "plus_code" : {
            "compound_code" : "FXXP+XG Isle of Dogs, London, UK",
            "global_code" : "9C3XFXXP+XG"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAtPay0qJVrF8VhfPHQxif8R8xWBbSJtdEBYOiXhSfT9bcjx5FxPfAy9nNvSSEWyY-7aDtqtenRu6ncf8KJhFHKRtgxOEf5QlpgquLSaKWU_i5Lp0tbP9agqVsBybqzp24EhDj6M0BLH_UV9WAPoZv_cMnGhT_tkS4bnQ8H3PTmRPUCW9naR5o9A",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "262 Poplar Business Park, Poplar High Street, London E14 9RL, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.5086375,
               "lng" : -0.0095166
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50998732989272,
                  "lng" : -0.008166770107277784
               },
               "southwest" : {
                  "lat" : 51.50728767010728,
                  "lng" : -0.01086642989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "888b138bddbe8073b1b99c25da7fd87b833e91ec",
         "name" : "ATM",
         "opening_hours" : {},
         "place_id" : "ChIJG2jYOK4CdkgRC9mtH3vAtGM",
         "plus_code" : {
            "compound_code" : "GX5R+F5 Canary Wharf, London, UK",
            "global_code" : "9C3XGX5R+F5"
         },
         "rating" : 2,
         "reference" : "CmRbAAAAPmWUsOd0vsvqnJTGVj3U6mkBo7TqFLng4DXhgvMr1PFZ1dKzweTeJGvYkkp8tS_BOuuk7dz0l6Uhioigw-nnTHFbSzSx5KtbIw49cM4b3DBEYoKVl2dYeweXl8KrANzqEhAskmLwtS6-zicDAFGNTGToGhTada1a-5oSgCK-J0DW8ViQtDgvsA",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "165 E India Dock Rd, Poplar, London E14 0EB, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.511352,
               "lng" : -0.0150753
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.51257842989272,
                  "lng" : -0.01371112010727779
               },
               "southwest" : {
                  "lat" : 51.50987877010728,
                  "lng" : -0.01641077989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/atm-71.png",
         "id" : "6668f08f261a0524cb8bb65203f1de832daf6978",
         "name" : "ATM",
         "place_id" : "ChIJwWyUtbMCdkgRuUz1B3_7ZDg",
         "plus_code" : {
            "compound_code" : "GX6M+GX Canary Wharf, London, UK",
            "global_code" : "9C3XGX6M+GX"
         },
         "rating" : 0,
         "reference" : "CmRbAAAAQ8TLvPeooIzwDP7Twlxos7qnCDn9yXeriGnMCCzAn59ee5QBm-DgDsFTMAwg7MBLolm7HLbYV6d1pfkQTLbA5JVXUtgV8OMNdZwntcY4RFupz2FPqZiUwCK5MkUflkdvEhBhbWz_WDhbSG7ivr4bh0TaGhSyvpl7Bl80fTGUB6CS7PBRRmWJGQ",
         "types" : [ "atm", "finance", "point_of_interest", "establishment" ]
      }
   ],
   "status" : "OK"
}}, true);
                        addLinkSnippet({
                            title: "Nearest ATM",
                            link : "https://goo.gl/maps/t18SY4E3CKK2",
                            target: "_blank"
                        });
                    } else if (intent === "my_location") {
                        addResponseMessage("You are currently at: 1 Churchill Place, London");
                        renderCustomComponent(SimpleMap, {}, true);
                    } else if(intent === "cash_back") {
                        addResponseMessage("I've found the following places near you that give you cash-back:");
                        renderCustomComponent(atmMap, {json: {
   "html_attributions" : [],
   "next_page_token" : "CpQCCAEAAM4GWmqhfizwt1F83srlaWBQD1s-ttwAt_MNMt4xc6s7G6vaXeBQsFg5eKc3zrp2_pZP6r3751r4HbraMhqX4WgIjzPsHZmJtXEAMSkRd5swRH0uTWUZq5rQYB0dMZhBZz_t12hmPKUR3mpXKt65BUQK8_jf8H3Z0XxdduvFK3U4B_iyl94y2yGzmFaLRjjBj0A5uR7n7PGirBHFt_mV73A_j7HjsfpPhFFv86VpbkCWDIab9gpJKTKpjtsRktlHsKsrBZvzCVmxgX9cNSbEyzSMn5YxH3Dt5xKlDu3Fk9MPZO5G9ux0y4o4Ec483R_TGJxKyXA_OZcACxovk1qZ66W22FQ4r45dZoRm9bamcumwEhA2e5RAlnrk-344g7QzF1nIGhQXmdwUT1JUvmTedA5zuWloaoqoRg",
   "results" : [
      {
         "formatted_address" : "17 S Colonnade, Canary Wharf, London E14 4PX, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5049832,
               "lng" : -0.0200301
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50618267989272,
                  "lng" : -0.01874222010727778
               },
               "southwest" : {
                  "lat" : 51.50348302010728,
                  "lng" : -0.02144187989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "4e8f6936e106efb6002f361ba09cc9daacd1b0e6",
         "name" : "Canary Wharf Shopping Centre",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2724,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100003761748305295041/photos\"\u003eVincent Z\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAuGY-TOdTT0skZurszXkKvkGnRPG5H8io-FRPtrr-EnHSFf6q59ZxX5x-OyyFk_CP3grhaLHdwut8IhNN9QPnBCNaWviASZJYVlPLyVPNP6LVOSJOTonPF7HiKWs8StnuEhCS2FEaXJq5WJNfPBTcLjw3GhQAEli7lHOlSjnzsESXGkAk0-qFjQ",
               "width" : 2879
            }
         ],
         "place_id" : "ChIJ84jeebcCdkgRZwwSLuE0Ps4",
         "plus_code" : {
            "compound_code" : "GX3H+XX Canary Wharf, London, UK",
            "global_code" : "9C3XGX3H+XX"
         },
         "rating" : 4.3,
         "reference" : "CmRbAAAAcjxYxuZoG35_HMMixlwsf3xZ-bDj_PLKzSRXHtWHEKNebZ8svAUUWhYx9lAOZ3jD9RkN2nJIt_uAvxsNuT9CdUIrGxDkcmbnsM980nokqUA_YGHnlKsNzq53A9t8bXeoEhD_GoATXWpa6HRLEkr3da-vGhQpeV_hnCxe22CkkpijGcZZPDU0AQ",
         "types" : [ "shopping_mall", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "45 Bank St, Canary Wharf, London E14 5NY, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5029553,
               "lng" : -0.0190798
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50430512989271,
                  "lng" : -0.01772997010727778
               },
               "southwest" : {
                  "lat" : 51.50160547010726,
                  "lng" : -0.02042962989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "6369173986c94693a601057e1545725c8fd084e7",
         "name" : "Sandro",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3024,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/104175708277153920229/photos\"\u003ePaul Bland\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAXhMofHeiaN7Rhweuog2o7a1irGMkh1VuHccMFeZN4WYMpBKuk8KGmlK9P6DagpJXGJdwHb-GC_HcOUPjY8oa_iyVb9j3oTHFR4v0p_g_Cvw0pFFOumLt6fT_YQOmQ60KEhAK8lGhvG-JpPRwrsaexWrDGhRGktb3iHai4Bo9CSdlCYCUH7P3QQ",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJNVA7vrkCdkgRjT8oOcBzRdM",
         "plus_code" : {
            "compound_code" : "GX3J+59 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+59"
         },
         "rating" : 3,
         "reference" : "CmRbAAAAdGlsq--4ve8FcjIn_fGiDJFBuk42Z-T_JSusaaOuk9J716yhAXhrlHg8hysYVG3udlYWfEEzBbkD_y-6_LZOIKRNQP4X731q9D_yZ1wy_Bl7W3xT2gIoyEvT0rUgfJA7EhDpDXZFzJ71tKEyw2Ubg-a5GhRlR1aGeY3ziKOBqNPA9L7FBT_Ewg",
         "types" : [ "clothing_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "22, Canada Square, Canary Wharf, London E14 5AH, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.50467219999999,
               "lng" : -0.0179787
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50602202989271,
                  "lng" : -0.01662887010727778
               },
               "southwest" : {
                  "lat" : 51.50332237010727,
                  "lng" : -0.01932852989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "1a10c5545021240c47b778ef3581fceca7078858",
         "name" : "Watches of Switzerland",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3366,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/116490933023156728639/photos\"\u003eTee Tong\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAQ4pKCjYbx8uE6jm4HQalj1cCJK-sBJZdDl04qkPBJGPXJziG_0f-g9U83Zv9ECqBDCNdXo0NCR4TfsPhlyhGS21NYIdOcvFoXVqlJLmBQYC--1guODavHV1DhqzW4JnrEhCpCcmmtJskm_HaEsxOyHeaGhQ7bNO9eZknnOwLuZO-_pzHKcV7HQ",
               "width" : 5984
            }
         ],
         "place_id" : "ChIJz4cgqbACdkgRKP1HoChaAEU",
         "plus_code" : {
            "compound_code" : "GX3J+VR Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+VR"
         },
         "rating" : 5,
         "reference" : "CmRbAAAAO9WzQ23ARSHPLd94kRMYrWYXrIr-G7WcqxuMFT2wgHAP40_e5HP4vTfiT5gH1M-Iex2gbVRK6ytqiNygEg2zRG6-fxDlQ1p9AVZzGi_U6VuTnGzWdcImOMnSBJuTTQVJEhC-qLqAs_hNjoKd4a38nHIWGhRoX56xej0pX3VQSwBD9JfQTrhuMw",
         "types" : [ "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "29 255 Cabot Square, Canary Wharf, London E14 4QS, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5050379,
               "lng" : -0.0223301
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50638772989272,
                  "lng" : -0.02098027010727779
               },
               "southwest" : {
                  "lat" : 51.50368807010728,
                  "lng" : -0.02367992989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "86cd8f968d5da044ccb641316caae893f5ffe726",
         "name" : "PANDORA Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3024,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/109731008226204341161/photos\"\u003eKaz H\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAA50HR-b281eShtuAKKz1HPSHpedVERbGRiwzCN17Fj7ogflIwVWr_A43bTZM28_cffNhHRE60rjfwJXkLipI5C6W9BERi4fjbArX7b2vqKDdss9d6zKyaLO_BTbamY7LMEhCQ0H4P830HxHLoeQjdLTA4GhSJbrWzkyd2MMCVFNTzlmqjRTgJ3g",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJk_2TBsgCdkgRKjIR7_8FUvw",
         "plus_code" : {
            "compound_code" : "GX4H+23 Canary Wharf, London, UK",
            "global_code" : "9C3XGX4H+23"
         },
         "rating" : 3,
         "reference" : "CmRbAAAAKfLxSZIzZIX4Fld-mLWA9IvHTPCpYVK7Of_r8G6i1Zi2gP4ubJZTHBqGoH8SX-ExH48e44E9soW2dC3UHZUJD5VKseM-G3ddk6Dl8-yy_fVbXqWwVjW2bD5vEh83VdGLEhBYR4hS1DaAANbOiRD5woLuGhQBKkC4PG7kfyctOuX1oJCn92Zl1A",
         "types" : [
            "jewelry_store",
            "clothing_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "Jubilee, Canary Wharf, London E14 5NY, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5031646,
               "lng" : -0.0189176
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50451442989273,
                  "lng" : -0.01756777010727778
               },
               "southwest" : {
                  "lat" : 51.50181477010729,
                  "lng" : -0.02026742989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "306ef679fda2b3d85396fc86685130f289a42364",
         "name" : "BIMBA Y LOLA",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 5312,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/107990687164575924686/photos\"\u003eKa Po Mok\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAYPJKL3qbtx2uFCT7o4JstPhei_SBVQU2aFVYw9LJM_4w246e_6EMaa1Or6M15i_1iWNz84iQncxUOSAgr8t_vpybgVUqwqfb_z_GOcJmeUd0rRCWsss49w-B54Js3Gz2EhBC6gtBGEBMFZQq7kK3e-V4GhSWTTwR-rvLl0TnJBXhgi9mg21CpQ",
               "width" : 2988
            }
         ],
         "place_id" : "ChIJucsrk7kCdkgR6_mppaKVhIk",
         "plus_code" : {
            "compound_code" : "GX3J+7C Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+7C"
         },
         "rating" : 5,
         "reference" : "CmRbAAAAuOA-Qe2_4w55xl-tksZo4-IWNij3B6SKP1b46_Nq-iu0oPpR0TMICQ7EKCal27MKx328LKargO0HMJ3sE1rJsrpa1FS9avQpJfsezVw4ldk9fCUVprLu9pWbFNbQ-F0EEhA-_8JtaHlaTiGh-O3aTsgCGhT2Lqd1mfrdHAp7_UASxO142H4UbA",
         "types" : [
            "clothing_store",
            "shoe_store",
            "jewelry_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "33 Bank St, Canary Wharf, London E14 5NY, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5029956,
               "lng" : -0.0178885
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50434542989272,
                  "lng" : -0.01653867010727778
               },
               "southwest" : {
                  "lat" : 51.50164577010728,
                  "lng" : -0.01923832989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "897521ba0e865001ff91e000ba55412936abf75d",
         "name" : "Cath Kidston",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3024,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/117665290828179346067/photos\"\u003eYawor Miah\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAVC_U9tgBMQBeU-1tGtoHDORexJvkhEjQ_Z9rpPhGipefqaXzfSbfEOkHG8II126x12phdbhwf-10oQVhst1p36BQzubOYxbCRpZWD2wGfuNESyUyjN-23HoDDd6gWyBAEhBDrIF0_RUUEAELlWtYwE7VGhSd6KpKZo1f5hzQNpF8XGP52h02nw",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJGTGdi7kCdkgRLfGmS4NIJuo",
         "plus_code" : {
            "compound_code" : "GX3J+5R Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+5R"
         },
         "price_level" : 3,
         "rating" : 4.7,
         "reference" : "CmRbAAAA6jHE4BWOylQ2jhqoB_IqYd8zBGKFZnhq4udRW47MYMrwEduAM6RP6JeEgK_aMSJ1s7BXp9ENEKtCNmSKNHgacv9kqVdf6Pck68lbKWAGHdfsHWE_NnTr8Fx-5Z9ZYSaAEhAj8-Yfutzue3vlHWa0ta92GhQZb139sPRdKVzKxAxgBcpp34HQpQ",
         "types" : [
            "clothing_store",
            "home_goods_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "Unit 2, Canada Square, Canary Wharf, London E14 5AX, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5050206,
               "lng" : -0.0188293
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50637042989272,
                  "lng" : -0.01747947010727779
               },
               "southwest" : {
                  "lat" : 51.50367077010728,
                  "lng" : -0.02017912989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "7055e0193151cc5d9397edc250699209bfa1ea67",
         "name" : "JD Sports",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 5312,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100530180329228199403/photos\"\u003eAmirhossein Zohrevand\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAb2bht8rguJIyX5ElLHmOtkb7rldHyCtniBaoOmtWs7y7luouZdLdEZhftce3Pt4XqSQIzKmN8eUgU7Be5Uxe3dPwWvRouCTzn6oGrEfvJbbN_3mF2VlKWyvakfLuApfcEhC1OaTi-zArqIqaJR2f2VzSGhTi3ObqDROMi8Tfu2TQVsdv98xLEw",
               "width" : 2988
            }
         ],
         "place_id" : "ChIJnS8vZLcCdkgRxYH9skI0nQc",
         "plus_code" : {
            "compound_code" : "GX4J+2F Canary Wharf, London, UK",
            "global_code" : "9C3XGX4J+2F"
         },
         "price_level" : 2,
         "rating" : 3,
         "reference" : "CmRbAAAAl8aGjRKJv_w2M4TghikgF9C3zySbEHBi8i7lpqfqNO5u3pNiUbBrbsZp8ByBVF_PvgCgB7PIxLJr4AFdwN0WhJNgtsqPzHR_d-mran21ff1d34Jti3gCi6xqNEJpR-KCEhDPK3DQ0_aKyAlzrlMbNHPVGhREw7t11_9SKnmUW6iZ1kPYdOyJTQ",
         "types" : [ "clothing_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "2 Churchill Pl, Canary Wharf, London E14 5RB, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5044796,
               "lng" : -0.0145661
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50582942989272,
                  "lng" : -0.01321627010727779
               },
               "southwest" : {
                  "lat" : 51.50312977010727,
                  "lng" : -0.01591592989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "a425f02b5d802a4dcc256df0705fc3dbab6e4336",
         "name" : "Runners Need",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3264,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100958211468259148536/photos\"\u003eYogit Wagh\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAj6vFs7E4ZcliPU8AkcoBEdFsD8zNniDcUAHxGLswrP7wk0U999Zkm8W5ofZqyqjHDCdhrMbcVV_F_XQXLr-3Sr5-m84ZH2bQdIJB45xWJE3E1-Y928qhEQHPBcWwGFoAEhCdSejR0_ywcUNSEGvvc_heGhQpNPH-nhErVrL3mQXtePcitpxMuQ",
               "width" : 2448
            }
         ],
         "place_id" : "ChIJk19MgroCdkgRFInBobAKcQQ",
         "plus_code" : {
            "compound_code" : "GX3P+Q5 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3P+Q5"
         },
         "rating" : 4.4,
         "reference" : "CmRbAAAAJvTgOBrKnOvDvEHZ88H1-eebok9yRMAQG0Se7AqC644eAH6tazOF_Vf01aMmPPdKzhXdTTqGd2n0akdM6ZTU2vzKRUc6cvbpsgA6iHOz0T75TFJr3JZOyg7oddxkaHiGEhDm2EtEB_i6NfXX3eVh_h8tGhRihTBquobvwujAlIR34sQBZDT8Pg",
         "types" : [
            "shoe_store",
            "clothing_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "Canada Pl, Canary Wharf, London E14 5AH, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5044966,
               "lng" : -0.018467
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50584642989271,
                  "lng" : -0.01711717010727779
               },
               "southwest" : {
                  "lat" : 51.50314677010727,
                  "lng" : -0.01981682989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "c92491307ac4067e11676dc73550b5315ec17624",
         "name" : "Charles Tyrwhitt Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 337,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/101580054098172218813/photos\"\u003eCharles Tyrwhitt\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAlVCDEcjmKsGQw09nTccp-GbBLOI3gbmfbWDlnF_xWoIbdpG1P9l5ORi2-dNckRQaaBt-V7rNmKdEK4F9o3G9Uv8it1JXCmp5vqv7uBCBg5tzIaBEkuqtPTpnCoElKGLLEhCPe4aQ7oOQ9T82G76ogHTBGhRX5ByZY4yK3zJ0cRhHwxhs-ZisRA",
               "width" : 599
            }
         ],
         "place_id" : "ChIJiehb-7kCdkgRm9C_SYRITrY",
         "plus_code" : {
            "compound_code" : "GX3J+QJ Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+QJ"
         },
         "rating" : 4.3,
         "reference" : "CmRbAAAAxIUeQCQC1kV2KEOMgLVHWl0b74aXAr0z60hoFlNZ9s5_R1D-HQVSfUI4cjXfZZceLETSvQ-vHIU02tz94fX0W9q_inNSpJZ309r-xLRAoy9fKQ5WOvxy1naH4JqRwP13EhCOlzNjRYI5D1bOIxCoDa8wGhRGxYeWc1lw1tbZGM1ErHGe8BKrbg",
         "types" : [ "clothing_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "6 S Colonnade, Canary Wharf, London E14 4PZ, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5047091,
               "lng" : -0.0220709
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50605892989273,
                  "lng" : -0.02072107010727779
               },
               "southwest" : {
                  "lat" : 51.50335927010728,
                  "lng" : -0.02342072989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "17c27793a3d46a4a27df04a15b3050efff27967a",
         "name" : "The Color Company - Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 1536,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100402158047326857548/photos\"\u003eThe Color Company - Canary Wharf\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAI4OUElK3t1NwZ0f5RHDybSOKRizKwDWWs61Vpw0iRY2fjWEAlDOHcWHOyzrXdhHp2U1cWUOgGPD1szRo2y69hAh1aQHSQ1-JtQc25RIKAuEn0ehC4eUw0pkqMM-CuX9lEhCCgXSsbvoIPH98S2b3V4ONGhTIQMbFmF_lWJU4vJgN3IReMV-DoA",
               "width" : 2048
            }
         ],
         "place_id" : "ChIJf-nlH7gCdkgRwmIChMivUWA",
         "plus_code" : {
            "compound_code" : "GX3H+V5 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3H+V5"
         },
         "rating" : 4.4,
         "reference" : "CmRbAAAA1h3UP5FgIgtI-W8jl4_akoFpTPp4gZfYT-CogLj8xCce4U853XIKMuPs-ZZB_7nQAXYrGhSFZJIydnH7vWgAvb5EI2BE_FgmP3xc_m-gh9N_n0G8B3ZBMwAgJ7pfeR7sEhDxUsq9hKkUR6xQIs8EmPFkGhQ_kSeu7RgdmDRCy26cZBSI6byQfA",
         "types" : [ "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Unit 5 Cabot Square, Canary Wharf, London E14 5AB, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.505226,
               "lng" : -0.02171
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50657582989272,
                  "lng" : -0.02036017010727778
               },
               "southwest" : {
                  "lat" : 51.50387617010728,
                  "lng" : -0.02305982989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "956bd458d2e7b074abdd0e7f3e1176ea406c13bf",
         "name" : "Boss Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2448,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/116076113680547844751/photos\"\u003eArjun Khara\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAATZLzavt-lFtubZxvJnzCECWCZy57z2dMPg-6qaLQoWVccH_cDGFNJYwkYWjXa-7nc1LR5yQ7wyPIUFYjqCyE-XjLJ_sWSuhVqA03xn5dVuGk_KyUaV4K9YtO9uTSVSM-EhBvrkybZoflGEvGzQhKimVrGhS_W1IDDVXnFW0YLJZn7UlplmBSFQ",
               "width" : 3264
            }
         ],
         "place_id" : "ChIJNwQDkrcCdkgRsCV7xf46Ku4",
         "plus_code" : {
            "compound_code" : "GX4H+38 Canary Wharf, London, UK",
            "global_code" : "9C3XGX4H+38"
         },
         "rating" : 3.7,
         "reference" : "CmRbAAAAmK-LHzeyxzexR9SaFW5qkz8Cs1-rfdsfPIlV4rGqxQL7hsjOXMADTdzcoSTjC2BjLiSqvt5P4o0vcKwTeC6w2Jb8EVFgZzvKoDI6pzfk8gGXad67fjPv5AUmBPg3pcE8EhAFgCiHnU2tads-e4DxRA3FGhRvq6bthM4C9JnETq78L7ia-uuUsQ",
         "types" : [ "clothing_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "11-12 Canada Square, Canary Wharf, London E14 5AH, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.50488619999999,
               "lng" : -0.0174304
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50623602989271,
                  "lng" : -0.01608057010727778
               },
               "southwest" : {
                  "lat" : 51.50353637010727,
                  "lng" : -0.01878022989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "69e6dca5ede120934942a2f297a7215bd771b4e2",
         "name" : "Accessorize Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2988,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/113330374472138617322/photos\"\u003eKevin Mowat\u003c/a\u003e"
               ],
               "photo_reference" : "CmRZAAAAzgmuZIh73dLQTCVD3uoC3z3JfnNO1sz5bZd1s41EJ1xe-5nXUg0kRYserMr8YU3vBlTJVI8dce96mKj7hNDG053B8HdEXeyRXUJX-lmSp35LcpJcr7eyC50EfmsthOTfEhAE3wFGC5Fq_WPgJbRI4WuiGhScaXrKSutflJtscxsIgCStuaBiYQ",
               "width" : 5312
            }
         ],
         "place_id" : "ChIJUxWaXrcCdkgRehTAPVoLt-c",
         "plus_code" : {
            "compound_code" : "GX3M+X2 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3M+X2"
         },
         "price_level" : 2,
         "rating" : 3.9,
         "reference" : "CmRbAAAA9sqQFy3w2R56bNHzuW88Okz2PmPLBgL2XGloKtTnf5YM3B_4Lo5mW2x2wWyhdVBFrGdgvvLuMP02xVkJw3Xm6GhBvmxBjw96HwjSY3rOFJIVV5WdnkeRLFz9a53qx2YsEhBUnzS4at-9Wx9piADBO3zzGhTcCVxcm87715ORKYY08yQQ4Ell4g",
         "types" : [
            "shoe_store",
            "jewelry_store",
            "clothing_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "16/17, Canary Wharf, Canada Square, Canary Wharf, London E14 5AX, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5045385,
               "lng" : -0.017336
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50588832989272,
                  "lng" : -0.01598617010727778
               },
               "southwest" : {
                  "lat" : 51.50318867010728,
                  "lng" : -0.01868582989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "770dd205a6c6dc60bb103541996e575627ba3913",
         "name" : "Gap",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 768,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/113476791042454719829/photos\"\u003eGregory Cl\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAHwG0d93IBTh-YU4d-c8YiHfWXOfZnFYDJkOwnV-vs7zkrxNwepurQSJMtda_iDD7XQJzU8bA1AIr8WXSDR_Gj1qQFY0bc-fQ232yFnNv3qVHsYBIMNgVuQSu7oGWMGG0EhDc0acYAMdfWudpSIat2hCmGhQUQEUIKf9jJy4RVq1fGP_WRAQ_9A",
               "width" : 1024
            }
         ],
         "place_id" : "ChIJiehb-7kCdkgRlI-thIWBbN4",
         "plus_code" : {
            "compound_code" : "GX3M+R3 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3M+R3"
         },
         "price_level" : 2,
         "rating" : 3.9,
         "reference" : "CmRbAAAAv-h2sP43GfBf7_gWUL9E7gPF2tS_iK_l1jti1YyDssWdtUTF6h3rd19k3t0yrzqmR6f6qWGyucAtZKid_zxqeDU3aqWDipKLLVai7BlGh8EqiUqHBEytPeQByBioLyytEhBwkHXsba0ix-ZzcLyIojeSGhTsXs8EDJ-LcgGyGH2kZi5kJUZSVQ",
         "types" : [ "clothing_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "Canary Wharf Group Plc, 2 S Colonnade, Canary Wharf, London E14 4PZ, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5047195,
               "lng" : -0.0221984
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50606932989272,
                  "lng" : -0.02084857010727778
               },
               "southwest" : {
                  "lat" : 51.50336967010728,
                  "lng" : -0.02354822989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "273b5735bb93f8ab4b7d2de44c4acda92a408984",
         "name" : "Bang & Olufsen of Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2248,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/105866895867160002944/photos\"\u003eRusstafa B\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAw41eiQi2oBtpNfhkbkLt-RUP0pjaDpK_NjnJDATF7DpxfampMuI6TaOHQAgNv9En7VobRjZbTktgwfcvYK6Ed0EgSUgbWqo9ftYxP4kUfYeVJvmtiMjaF0aurzskXoeEEhBLoaQ0kaRV3B1mkbv96ScIGhQNlbGKCGFezLWnUNPFg1hu2aUnpg",
               "width" : 2493
            }
         ],
         "place_id" : "ChIJwXBs9LcCdkgR4w3SkRhAOgE",
         "plus_code" : {
            "compound_code" : "GX3H+V4 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3H+V4"
         },
         "price_level" : 4,
         "rating" : 3.9,
         "reference" : "CmRbAAAADAgwULDT6RjgTheyODpDLjZPBrWF9DNnsNW4BZURcr79vwHSGVHspOzSBbNod5jcvhoxsZMCD6gkPh8MMEVrAFwxcaiEQWB8DLkC83HTjcq7E-cpAIgbSPeK4CryqrGVEhBY9TnaAbtzftt9L56a7biiGhRhVNQxpLlOavX_HtQNN1o38xzJoQ",
         "types" : [
            "electronics_store",
            "home_goods_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      },
      {
         "formatted_address" : "445, Concourse Level Unit RP, 1 Canada Square, London 514 5AX, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.5050609,
               "lng" : -0.0196304
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50641072989271,
                  "lng" : -0.01828057010727778
               },
               "southwest" : {
                  "lat" : 51.50371107010727,
                  "lng" : -0.02098022989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "352717d070a7419facf034fed490121c2559c612",
         "name" : "Scribbler",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 2998,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/110737476398743565245/photos\"\u003eLiam Sharpe\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAm_Ekzm-D8HTn6M7f--RVD49TmNtPCz_K9-TObJnWLuu4lmJ6VK-RRAXGKNsaGaHRsGUNcFCTPn_qlaZEX7UPygvd4mLJFUo6R_BTcEzkha7JUfucjLNYtF80_mZkugeFEhCDnLoDBfjJqS0P4ljJ3BP0GhTpcYvTuuDMuSHSCYUHc6epCDiV5A",
               "width" : 3610
            }
         ],
         "place_id" : "ChIJGVo7YbcCdkgRllsXn4amQ_Q",
         "plus_code" : {
            "compound_code" : "GX4J+24 Canary Wharf, London, UK",
            "global_code" : "9C3XGX4J+24"
         },
         "rating" : 3.9,
         "reference" : "CmRbAAAA5ZSKpHmHXsBxh7S5hpyc8QsoChySgjel-dU0QmvVBvZJHY2Vz0wr9OIneuBtBUBzlsNqWgpNQqPZMEqwagLzlVIB3ehmo2NRw5HcAthghzeJTffLbxMCAL7eJ8wzGksAEhAzsJooylHNktk6BCSvCXOJGhRystwfrlskJ2mVd-ZwtdFvCCDAEQ",
         "types" : [ "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "16-19 Canada Square, Canary Wharf, London E14 5EQ, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.50451589999999,
               "lng" : -0.0168948
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50586572989271,
                  "lng" : -0.01554497010727778
               },
               "southwest" : {
                  "lat" : 51.50316607010726,
                  "lng" : -0.01824462989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "887c722fe9c918077854d36baf46a9f6aff781f0",
         "name" : "Hotel Chocolat",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 3024,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/103504172384124072021/photos\"\u003eSheila Harjani\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAbQFn-fhErLWhPcrtkMqaRVr25JCMGzNAZoMfgFaKP0qoso1JOQRBNdoFAw-s3Xuc3PlWv0jEh-sjjET6ib-9fZCTPEqUhOkEwv3okHoBf_gLVqCi3FmX3xblUdHlNHQcEhA6flcw_qFIzbPTZjcL4W8eGhRqXFJ2L3UCHaK_1M3GdanOepP5qw",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJnS8vZLcCdkgRo9iM0p4QSPM",
         "plus_code" : {
            "compound_code" : "GX3M+R6 Canary Wharf, London, UK",
            "global_code" : "9C3XGX3M+R6"
         },
         "price_level" : 3,
         "rating" : 2.7,
         "reference" : "CmRbAAAAZjQP0VcK1qCqaMaLSJUy9sH5CzSJZOnyApawoWhn6q2lKQNdXNkNHQxGXyuysYSGIULIvrcPa5q66rFAIZXTChCF3DPUoAUUSO4-_GWVcehu-7g1dsUIab2xTbISZmcbEhBYiDWvO5Qg77jESj3YPXcaGhSLaG24VXi5x4G5gvqQcF4H9el3fA",
         "types" : [ "store", "food", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "6 Canada Square, Canary Wharf, London E14 5AH, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5050567,
               "lng" : -0.020468
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50640652989272,
                  "lng" : -0.01911817010727778
               },
               "southwest" : {
                  "lat" : 51.50370687010728,
                  "lng" : -0.02181782989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "56927542a553cbcdfaa46031c27a62ca45aee7a4",
         "name" : "Montblanc",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 478,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/103573537107341813182/photos\"\u003eMontblanc London - Canary Wharf\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAIoNAcSylaZrbUInkFFH7lEP5jdg_3Ng4XH1VrFJW91pc3urPsq2ylctI-ayEqDvYwvd3oQI9_Q97o_J2JZBwPMVJB7rS3sQli2sy8-NU2qzhqUlRM8dwW214m8pf0u03EhATWmIWi6YV4evDGF3PdiBPGhQYpUIt8pHsOFzRle62Rh5jlIdvNg",
               "width" : 480
            }
         ],
         "place_id" : "ChIJ-0D4icQEdkgRyzHFeUDewEU",
         "plus_code" : {
            "compound_code" : "GX4H+2R Canary Wharf, London, UK",
            "global_code" : "9C3XGX4H+2R"
         },
         "rating" : 3.3,
         "reference" : "CmRbAAAA4xzPkbT9a_tXXmYFURYJHE8jvJcE_bqNhkTCc8fi1jX4sp9u9UGsM_DCfOik-edNpVVj7JsYnlUGvtpOeBw7nGXgv9h4QzgoCWPOjIFQrbI5DK8rByjpLbDkRXyUCCnHEhB-5zcwHikSXSnYmeD4-rO-GhTtR02-C9CIDcTW73tcO5GJcFX7Vg",
         "types" : [ "jewelry_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "360/365 Cabot Square, Canary Wharf, London E14 4QT, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.50484669999999,
               "lng" : -0.0202417
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50619652989272,
                  "lng" : -0.01889187010727778
               },
               "southwest" : {
                  "lat" : 51.50349687010727,
                  "lng" : -0.02159152989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "1effd5640036ec3fb744b87aa1d26d1f7b80858d",
         "name" : "Paul Smith Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 1452,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/110677347400837203079/photos\"\u003ePaul Smith Canary Wharf\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAA6SO9HafRmhvb-1m3REWm5eJBY8eExN8CTGUb5aZX7hJ6fu19QNsibCQ0ALpUQ9zQoMshhCLZjlJ6t4VyuFuGQk3UpUNOFdB4THNmEPXwXvLfHHOk5Nvl_neS6ldRwT4rEhCdI8kqTFafpcryQWHJ8gwaGhR4Z0lInwuj72lxTWgEhWuJxtEKaw",
               "width" : 2000
            }
         ],
         "place_id" : "ChIJoTVEeLcCdkgRRmrj0S2j3M4",
         "plus_code" : {
            "compound_code" : "GX3H+WW Canary Wharf, London, UK",
            "global_code" : "9C3XGX3H+WW"
         },
         "rating" : 4.7,
         "reference" : "CmRbAAAA9Qp6S3c9f9CCxE_VDX9NDnguuO8hmjWpc0wuU2BJrjqRqhG_A1h39hF9IybTw4-3OZhmOosDBJifhJCXbiFz7fmIwMwCI6akIDWb1jIbNH4s96td1x4fnOp9CdRT1BYfEhCrZ8bgbwo037bq3fB5Ea8DGhTEdScRzvcrowk9VcTZpPQh0dPuxg",
         "types" : [ "clothing_store", "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "RT3 B1 Jubilee Place, London E14 5NY, United Kingdom",
         "geometry" : {
            "location" : {
               "lat" : 51.50302319999999,
               "lng" : -0.0188889
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50437302989272,
                  "lng" : -0.01753907010727778
               },
               "southwest" : {
                  "lat" : 51.50167337010728,
                  "lng" : -0.02023872989272222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "d7c5f6ed617cfbee96fe030bf481ed9a5ec3954b",
         "name" : "Paperchase",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 698,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100783130919191847541/photos\"\u003ePaperchase\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAA-_89H6IU-118rsZkXGeJv_09qTsYCmJ-genZ9YzxC3AedTtrz_AvwuDXCU_H3xSwvANgY67xvWLvYpa7lsVbbzjeCqkH6uYO9mBuTduFV-6dMfxhYTF51Di5odvnWIDuEhAJFwHo9Ypyk8zpXh63Be7ZGhTmI2anapoGieUqZVsXgv39LUG5Bg",
               "width" : 699
            }
         ],
         "place_id" : "ChIJIfz9mbkCdkgRDHPytj5-nWc",
         "plus_code" : {
            "compound_code" : "GX3J+6C Canary Wharf, London, UK",
            "global_code" : "9C3XGX3J+6C"
         },
         "price_level" : 2,
         "rating" : 4,
         "reference" : "CmRbAAAAODGzXOjAdlo6_tog8Jj5DAPeJ7b9y49F8J_ADiTyddULvT7dAEoam9mQ6NQSXXj7TnopTMoQimMhBKNlhJOxX3gh9XUzaEWBTN44m72VjKJI9bm9HcvhuBbJANzAhCnvEhAyXotYmXh86J-4AJjSrb7aGhQgJYD96Y1L-Ux4ypXCeRHDcH7WVA",
         "types" : [ "store", "point_of_interest", "establishment" ]
      },
      {
         "formatted_address" : "31, Canary Wharf Group Plc, Jubilee Place, 45 Bank St, Canary Wharf, London E14 5NY, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.5056515,
               "lng" : -0.0213249
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 51.50700132989272,
                  "lng" : -0.01997507010727778
               },
               "southwest" : {
                  "lat" : 51.50430167010728,
                  "lng" : -0.02267472989272221
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
         "id" : "0de97e1626a5d1a1bdf3a2b225bc2e5e797aa53e",
         "name" : "LK Bennett Canary Wharf",
         "opening_hours" : {
            "open_now" : true
         },
         "photos" : [
            {
               "height" : 1536,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/108347017725503679772/photos\"\u003eL.K. Bennett\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAsxh95iVwUc1SFLAxrD3PWP7YYqGHen5cBFGnSUYW5HhpN94y4axD0YJdTVwzVpZ29v2QKHLEcOq1y8v9FItR4ldtaNc46l-g4EXutUE3SVZvDzmqbcf4QAEQc-TUNpbpEhDpFgeyvXmYSboIY4LaQErfGhQi7yl0DOO6LxwIPYhwbtwofxBy5A",
               "width" : 2048
            }
         ],
         "place_id" : "ChIJu3FPl7kCdkgRi2uLnQigV08",
         "plus_code" : {
            "compound_code" : "GX4H+7F Canary Wharf, London, UK",
            "global_code" : "9C3XGX4H+7F"
         },
         "price_level" : 3,
         "rating" : 3.5,
         "reference" : "CmRbAAAAvwzWtnXQd3ipNebQAQdgSCszkH7ojpw0lmLB-WryyYkSQpKkmB9CWpjv0V6i_cej0H9_bn6lZ0Ev_gJ-YhxOIKD8UvYa-pgwa20SHCdDPGZyiczUrOSo3FLWJCr84HHKEhATeLk_EaXXAfBAJ-fro5OrGhSQqGYLV7CyJSA9fbfVxup_a5PsEg",
         "types" : [
            "clothing_store",
            "shoe_store",
            "store",
            "point_of_interest",
            "establishment"
         ]
      }
   ],
   "status" : "OK"
}}, true);
                    }
                }
                catch (e) {
                    addResponseMessage("Can I help you with something else?");
                }
            });
    };

    render() {
        return (
            <div>
                <h1>Jibu. <br/> It's all about you. </h1>
                <Widget
                    title="Jibu 1.0"
                    subtitle=""
                    titleAvatar={logo}
                    profileAvatar={logo}
                    handleNewUserMessage={this.handleNewUserMessage}
                />
            </div>)
    }
}

export default App;
