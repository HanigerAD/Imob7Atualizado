import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { LegacyRef, ReactElement, useEffect, useRef } from "react";

const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <></>;
};

function MyMapComponent({
    latLngLiteral,
    zoom,
    onChangeLatLng,
    onChangeAddress,
    ...props
}: {
    latLngLiteral: google.maps.LatLngLiteral;
    zoom: number;
    onChangeLatLng: (value: google.maps.LatLngLiteral) => void;
    onChangeAddress: (newAddress: string) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (ref && ref.current) {
            const mapDiv = ref.current as HTMLElement;
            const latLng = new google.maps.LatLng(latLngLiteral);

            const map = new window.google.maps.Map(mapDiv, {
                zoom,
                center: latLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            const marker = new google.maps.Marker({
                position: latLng,
                title: 'Localização',
                map: map,
                draggable: true
            });

            const geocoder = new google.maps.Geocoder();

            const geocodePosition = (latLngLiteral: google.maps.LatLngLiteral) => {
                geocoder.geocode({
                    location: latLngLiteral
                }, function (responses) {
                    if (responses && responses.length > 0) {
                        onChangeAddress(responses[0].formatted_address);
                    } else {
                        onChangeAddress('Não é possível determinar o endereço neste local.');
                    }
                });
            }

            geocodePosition(latLngLiteral);

            google.maps.event.addListener(marker, 'dragstart', function () {
                onChangeAddress('Procurando...');
            });

            google.maps.event.addListener(marker, 'drag', function () {
                // onChangeAddress('Procurando...');
                // const position = marker.getPosition();

                // if (position) {
                //     const newLatLngLiteral = { lat: position.lat(), lng: position.lng() }
                //     onChangeLatLng(newLatLngLiteral);
                // }
            });

            google.maps.event.addListener(marker, 'dragend', function () {
                const position = marker.getPosition();

                if (position) {
                    const newLatLngLiteral = { lat: position.lat(), lng: position.lng() }
                    onChangeLatLng(newLatLngLiteral);
                    geocodePosition(newLatLngLiteral);
                }
            });
        }
    }, [ref]);

    return <div ref={ref} id="map" {...props} />;
}

export function MapaComponent({ latLngLiteral, onChangeAddress, onChangeLatLng, ...props }: {
    latLngLiteral: google.maps.LatLngLiteral;
    onChangeLatLng: (value: google.maps.LatLngLiteral) => void;
    onChangeAddress: (newAddress: string) => void;
    [key: string]: any
}) {
    const zoom = 16;

    return (
        <Wrapper apiKey="AIzaSyBqzcZLwuyUtPNxtjVvEV_5Q3OEIz-8VKc" render={render}>
            <MyMapComponent onChangeAddress={onChangeAddress} onChangeLatLng={onChangeLatLng} latLngLiteral={latLngLiteral} zoom={zoom} {...props} />
        </Wrapper>
    );
}
