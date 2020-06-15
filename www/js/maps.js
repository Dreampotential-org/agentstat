function initTransactionMap(coordinates) {
    var map = new google.maps.Map(document.getElementById('transaction-map'), {
        zoom: 8,
        center: coordinates[0]
    });

    $.each(coordinates, function(k, v) {
        var marker = new google.maps.Marker({
            position: v,
            map: map,
        });

        attachSecretMessage(marker ,map, v.address)
    });
    
    function attachSecretMessage(marker, map, address) {
        var infowindow = new google.maps.InfoWindow({
            content: address
        });

        marker.addListener('click', function() {
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            infowindow.open(map, marker);
        });
    }
    
}

