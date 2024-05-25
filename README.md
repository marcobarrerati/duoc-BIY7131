# Big Data - Evaluación Parcial 2

marc.barrera@duocuc.cl

# 0- Preparación de Entorno

## Instalación de SDK

```
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-475.0.0-linux-x86_64.tar.gz
```
```
tar -xf google-cloud-cli-475.0.0-linux-x86_64.tar.gz
```
```
google-cloud-sdk/install.sh
```

## Iniciar 

```
google-cloud-sdk/bin/gcloud init
```

## Crear Proyecto
referencia : https://cloud.google.com/sdk/gcloud/reference/projects/create
```
google-cloud-sdk/bin/gcloud projects create evaluacion02 --organization=527750334036
```

### Ver lista de proyectos
```
google-cloud-sdk/bin/gcloud projects list
```

## Crear Bucket

Referencia: https://cloud.google.com/storage/docs/creating-buckets?hl=es-419#storage-create-bucket-cli
```
google-cloud-sdk/bin/gcloud storage buckets create gs://bucket-evaluacion02 --location=US
```

### Listar bucket

```
google-cloud-sdk/bin/gcloud storage buckets list
```

# 1- Carga de datos en Cloud Storage 

## Subir archivos txt

Referencia: https://cloud.google.com/storage/docs/gsutil/commands/cp
```
google-cloud-sdk/bin/gsutil cp GTFS-V123-PO20240518/*.txt gs://bucket-evaluacion02
```

# 2- Análisis de datos en BigQuery: 

referencia: https://cloud.google.com/bigquery/docs/quickstarts/load-data-bq?hl=es-419

## Crear dataset

```
google-cloud-sdk/bin/bq --location=US mk -d --default_table_expiration 3600 --description="dataset evaluación 02" evaluacion02
```

### Listar dataset

```
google-cloud-sdk/bin/bq ls
```

## Cargar datos en una tabla

```
google-cloud-sdk/bin/bq load evaluacion02:evaluacion02.agency gs://bucket-evaluacion02/agency.txt agency_id:string,agency_name:string,agency_url:string,agency_timezone:string
```

### Listar tablas en dataset

```
google-cloud-sdk/bin/bq ls evaluacion02
```

### Revisar Esquema de la tabla
```
google-cloud-sdk/bin/bq show evaluacion02.agency
```

### Listar registros de la tabla
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT agency_id,
agency_name,
agency_url,
agency_timezone
FROM 
`evaluacion02.agency`
```
```
+-----------+--------------------------------+-----------------------------+------------------+
| agency_id |          agency_name           |         agency_url          | agency_timezone  |
+-----------+--------------------------------+-----------------------------+------------------+
| agency_id | agency_name                    | agency_url                  | agency_timezone  |
| RM        | Red Metropolitana de Movilidad | http://www.red.cl           | America/Santiago |
| M         | Metro de Santiago              | http://www.metro.cl         | America/Santiago |
| MT        | EFE Trenes de Chile            | http://www.efe.cl           | America/Santiago |
| BAA       | Bus de Acercamiento Aeropuerto | http://www.nuevopudahuel.cl | America/Santiago |
+-----------+--------------------------------+-----------------------------+------------------+
```
