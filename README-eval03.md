# Big Data - Evaluación Parcial 3


# Preparación de Entorno

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
google-cloud-sdk/bin/gcloud projects create evaluacion003 --organization=527750334036
```

## Ver lista de proyectos

```
google-cloud-sdk/bin/gcloud projects list
```

## Seleccionar el proyecto

```
$ gcloud project set project evaluacion003
```

## Habilitar APIS

* Compute Engine
* Dataflow
* Cloud Logging
* BigQuery
* Pub/Sub
* Cloud Storage
* Resource Manager
* Cloud Scheduler

```
$ gcloud services enable compute.googleapis.com dataflow.googleapis.com logging.googleapis.com bigquery.googleapis.com pubsub.googleapis.com storage.googleapis.com cloudresourcemanager.googleapis.com cloudscheduler.googleapis.com
```

## Crear credenciales de con Google

```
$ gcloud auth application-default login
```

## Otorgar Roles

* roles/dataflow.admin
* roles/dataflow.worker
* roles/storage.admin
* roles/pubsub.editor
* roles/bigquery.dataEditor

```
$ gcloud projects add-iam-policy-binding evaluacion003 --member="user:marc.barrera@duocuc.cl" --role=roles/dataflow.admin
$ gcloud projects add-iam-policy-binding evaluacion003 --member="user:marc.barrera@duocuc.cl" --role=roles/dataflow.worker
$ gcloud projects add-iam-policy-binding evaluacion003 --member="user:marc.barrera@duocuc.cl" --role=roles/storage.admin
$ gcloud projects add-iam-policy-binding evaluacion003 --member="user:marc.barrera@duocuc.cl" --role=roles/pubsub.editor
$ gcloud projects add-iam-policy-binding evaluacion003 --member="user:marc.barrera@duocuc.cl" --role=roles/bigquery.dataEditor
```

## Crear Bucket
```
gcloud storage buckets create gs://bucket-evaluacion03
```

## Listar bucket
```
gcloud storage buckets list
```
## Crear un tema (topic)

```
gcloud pubsub topics create topic-evaluacion03

```
## Crear una subscripción

```
gcloud pubsub subscriptions create sub-evaluacion03 --topic=topic-evaluacion03
```

## Crear Cloud Scheduler

* Publicaremos un mensaje cada un minuto

```
gcloud scheduler jobs create pubsub publicacion-cada-un-minuto-evaluacion03 \
  --schedule="* * * * *" \
  --location=us-central1 \
  --time-zone="America/Santiago" \
  --topic="topic-evaluacion03" \
  --message-body='{"url": "https://www.duoc.cl/", "review": "diurno"}'
```

* Publicaremos un mensaje cada dos minutos
```
gcloud scheduler jobs create pubsub publicacion-cada-dos-minutos-evaluacion03 \
  --schedule="*/2 * * * *" \
  --location=us-central1 \
  --time-zone="America/Santiago" \
  --topic="topic-evaluacion03" \
  --message-body='{"url": "https://www.duoc.cl/", "review": "vespertino"}'
```
## Iniciar el trabajo en Cloud Scheduler

```
$ gcloud scheduler jobs run --location=us-central1  publicacion-cada-un-minuto-evaluacion03
$ gcloud scheduler jobs run --location=us-central1  publicacion-cada-dos-minutos-evaluacion03
```

## Crear conjunto de datos en BigQuery

```
$ bq --location=US mk  --description="dataset evaluación 03" evaluacion03
```
## Creamos una tabla
- Creamos una tabla para almacenar los mensajes

```
bq mk --table evaluacion003:evaluacion03.evaluacion03 url:STRING,review:STRING
```

## listar dataset

```
$ bq list
```

## Creamos una función JS

La siguiente UDF valida las URL de los mensajes entrantes. Las mensajes sin URL o con URL incorrectas se reenvían a una tabla de salida diferente con el sufijo _error_records, también conocida como tabla de mensajes no entregados, en el mismo proyecto y conjunto de datos.

```javascript
/**
 * User-defined function (UDF) to transform events
 * as part of a Dataflow template job.
 *
 * @param {string} inJson input Pub/Sub JSON message (stringified)
 */
 function process(inJson) {
    const obj = JSON.parse(inJson);
    const includePubsubMessage = obj.data && obj.attributes;
    const data = includePubsubMessage ? obj.data : obj;

    if (!data.hasOwnProperty('url')) {
      throw new Error("No url found");
    } else if (data.url !== "https://www.duoc.cl/") {
      throw new Error("Unrecognized url");
    }

    return JSON.stringify(obj);
  }
```


## Pipeline

```
gcloud dataflow jobs run job-evaluacion03_1 \
    --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_Subscription_to_BigQuery \
    --region us-central1 \
    --staging-location gs://bucket-evaluacion03/temp \
    --parameters \
inputSubscription=projects/evaluacion003/subscriptions/sub-evaluacion03,\
outputTableSpec=evaluacion003:evaluacion03.evaluacion03,\
```

```
gcloud dataflow jobs run job-evaluacion03_2 \
    --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_Subscription_to_BigQuery \
    --region us-central1 \
    --staging-location gs://bucket-evaluacion03/temp \
    --parameters \
inputSubscription=projects/evaluacion003/subscriptions/sub-evaluacion03,\
outputTableSpec=evaluacion003:evaluacion03.evaluacion03,\
javascriptTextTransformGcsPath=gs://bucket-evaluacion03/evaluacion03.js,\
javascriptTextTransformFunctionName=process
```

## Verificar

```
gcloud pubsub topics publish topic-evaluacion03 \
  --message='{"url": "https://beam.apache.org/documentation/sdks/java/", "review": "positive"}'
```

```
gcloud pubsub topics publish topic-evaluacion03 \
  --message='{"url": "https://www.duoc.cl/", "review": "vespertino"}'
```

## Ver los resultados

```
bq query --use_legacy_sql=false 'SELECT * FROM `'"evaluacion003:evaluacion03.evaluacion03"'`'
```
```
+----------------------+------------+
|         url          |   review   |
+----------------------+------------+
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl/ | vespertino |
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | diurno     |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | vespertino |
| https://www.duoc.cl  | positive   |
| https://www.duoc.cl  | diurno     |
+----------------------+------------+
```


