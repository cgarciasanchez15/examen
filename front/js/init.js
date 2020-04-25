function init() {
    $('#region-select').on('change', function () {
        changeRegion(this.value);
    });
    moment.locale('es');
    getData();
}

/**
 * Llama la info de del servidor
 */
function getData() {
    $("#message-container h3").html("Cargando informaci&oacute;n por favor espere");
    $("#controls").hide();
    $.get("http://3.130.176.26:3000/getBases/", function (data) {
        $("#message-container h3").html("Procesando informaci&oacute;n");
        renderFechas(data.fechas);
        renderRegiones(data.regiones);
        formatBases(data.bases, data.fechas);
        $("#controls").show();
    });

}

function renderRegiones(regiones) {

    $("#region-select").html(`<option value="0">Todas</option>`);
    $.each(regiones, (i, region) => {
        $("#region-select").append(`<option value="${region}">Region ${region}</option>`);
    });

}

function renderFechas(fechas) {
    $("#table-head").html(`<th>Radio Base</th>`);
    $.each(fechas, (i, fecha) => {
        $("#table-head").append(`<th>${moment(fecha, 'YYYY-MM-DD').format('DD MMM')}</th>`);
    });
}

/**
 * Formatea y renderea cada radiobase
 * @param basesData
 */
function formatBases(basesData, fechas) {
    $("#bases-body").empty();
    $.each(basesData, (baseId, data) => {
        let td = '';
        $.each(fechas, (i, fecha) => {
            if (data.fechas[fecha]) {
                let bgClass = 'bg-secondary';

                switch (data.fechas[fecha].estado) {
                    case 4:
                        bgClass = 'bg-danger';
                        break;
                    case 3:
                        bgClass = 'bg-orange';
                        break;
                    case 2 :
                        bgClass = 'bg-warning';
                        break;
                    case 1:
                        bgClass = 'bg-success';
                        break;
                }

                td += `<td class="${bgClass}">${data.fechas[fecha].trafico}</td>`;
            } else {
                td += `<td class="bg-secondary">--</td>`;
            }
        });
        const h = `<tr><td>${baseId}</td>${td}</tr>`;
        $("#bases-body").append(h);
    });

    $("#message-container").hide();
    $("#table-container").show();
}


function changeRegion(region) {
    $("#table-container").hide();
    $("#message-container").show();
    $("#search-rb").val('');
    $.get("http://3.130.176.26:3000/getBases/region/" + region, function (data) {
        renderFechas(data.fechas);
        formatBases(data.bases, data.fechas);
    });
}

function searchRb(event) {
    const rbsv = $("#search-rb").val();
    $("#table-container").hide();
    $("#message-container").show();

    $.get("http://3.130.176.26:3000/getBases/base/" + rbsv, function (data) {
        renderFechas(data.fechas);
        formatBases(data.bases, data.fechas);
    });
}