function initTransactionMap(coordinates) {
    var map = new google.maps.Map(document.getElementById('transaction-map'), {
        zoom: 8,
        center: coordinates[0]
    });

    $.each(coordinates, function(k, v) {
        if (v.status == 'Sold') {
            var imagePath = '/../img/map-green-marker.png';
        } else {
            var imagePath = '/../img/map-red-marker.png';
        }
        var image = {
            url: imagePath,
            scaledSize: new google.maps.Size(25, 40),
        };

        var marker = new google.maps.Marker({
            position: v,
            map: map,
            icon: image,
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

