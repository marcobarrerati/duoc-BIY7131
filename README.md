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

## Cargar datos en tablas del dataset

### agency

```
google-cloud-sdk/bin/bq load evaluacion02:evaluacion02.agency gs://bucket-evaluacion02/agency.txt agency_id:string,agency_name:string,agency_url:string,agency_timezone:string
```

### calendar_dates
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.calendar_dates gs://bucket-evaluacion02/calendar_dates.txt service_id:string,date:numeric,exception_type:numeric
```

### calendar
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.calendar gs://bucket-evaluacion02/calendar.txt  service_id:string,monday:numeric,tuesday:numeric,wednesday:numeric,thursday:numeric,friday:numeric,saturday:numeric,sunday:float,start_date:numeric,end_date:numeric 
```

### feed_info
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.feed_info gs://bucket-evaluacion02/feed_info.txt  feed_publisher_name:string,feed_publisher_url:string,feed_lang:string,feed_start_date:numeric,feed_end_date:numeric,feed_version:string
```

### frequencies
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.frequencies gs://bucket-evaluacion02/frequencies.txt  trip_id:string,start_time:string,end_time:string,headway_secs:numeric,exact_times:numeric
```

### routes
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.routes gs://bucket-evaluacion02/routes.txt  route_id:string,agency_id:string,route_short_name:string,route_long_name:string,route_desc:string,route_type:string,route_url:string,route_color:string,route_text_color:string
```

### shapes
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.shapes gs://bucket-evaluacion02/shapes.txt  shape_id:string,shape_pt_lat:float,shape_pt_lon:float,shape_pt_sequence:numeric
```

### stops
```
google-cloud-sdk/bin/bq load --skip_leading_rows=1 evaluacion02:evaluacion02.stops gs://bucket-evaluacion02/stops.txt  stop_id:String,stop_code:string,stop_name:string,stop_lat:float,stop_lon:float,stop_url:string,wheelchair_boarding:string
```

## Listar tablas en dataset

```
google-cloud-sdk/bin/bq ls evaluacion02
```
```
     tableId       Type    Labels   Time Partitioning   Clustered Fields  
 ---------------- ------- -------- ------------------- ------------------ 
  agency           TABLE                                                  
  calendar         TABLE                                                  
  calendar_dates   TABLE                                                  
  feed_info        TABLE                                                  
  frequencies      TABLE                                                  
  routes           TABLE                                                  
  shapes           TABLE                                                  
  stops            TABLE 
```

### routes
```
google-cloud-sdk/bin/bq show evaluacion02.routes
```
```
Table evaluacion02:evaluacion02.routes

   Last modified              Schema              Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- ----------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:40:17   |- route_id: string           415          27813         21 Jun 03:40:17                                          27813                 10293                          
                    |- agency_id: string                                                                                                                                                   
                    |- route_short_name: string                                                                                                                                            
                    |- route_long_name: string                                                                                                                                             
                    |- route_desc: string                                                                                                                                                  
                    |- route_type: string                                                                                                                                                  
                    |- route_url: string                                                                                                                                                   
                    |- route_color: string                                                                                                                                                 
                    |- route_text_color: string 
```


## Revisar Esquema de las tabla

### agency
```
google-cloud-sdk/bin/bq show evaluacion02.agency
```
```
Table evaluacion02:evaluacion02.agency

   Last modified              Schema             Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- ---------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:18:49   |- agency_id: string         5            333           21 Jun 03:18:49                                          333                   1952                           
                    |- agency_name: string                                                                                                                                                
                    |- agency_url: string                                                                                                                                                 
                    |- agency_timezone: string  
```
### calendar
```
google-cloud-sdk/bin/bq show evaluacion02.calendar
```
```
Table evaluacion02:evaluacion02.calendar

   Last modified            Schema           Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- ------------------------ ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:46:35   |- service_id: string    3            417           21 Jun 03:46:35                                          417                   2175                           
                    |- monday: numeric                                                                                                                                                
                    |- tuesday: numeric                                                                                                                                               
                    |- wednesday: numeric                                                                                                                                             
                    |- thursday: numeric                                                                                                                                              
                    |- friday: numeric                                                                                                                                                
                    |- saturday: numeric                                                                                                                                              
                    |- sunday: float                                                                                                                                                  
                    |- start_date: numeric                                                                                                                                            
                    |- end_date: numeric  
```

### calendar_date
```
google-cloud-sdk/bin/bq show evaluacion02.calendar_dates
```
```
Table evaluacion02:evaluacion02.calendar_dates

   Last modified              Schema             Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- ---------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:45:33   |- service_id: string        24           840           21 Jun 03:45:33                                          840                   1546                           
                    |- date: numeric                                                                                                                                                      
                    |- exception_type: numeric  
```

### feed_info
```
google-cloud-sdk/bin/bq show evaluacion02.calendar_dates
```
```
Table evaluacion02:evaluacion02.feed_info

   Last modified                Schema               Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- -------------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:47:22   |- feed_publisher_name: string   1            89            21 Jun 03:47:22                                          89                    2176                           
                    |- feed_publisher_url: string                                                                                                                                             
                    |- feed_lang: string                                                                                                                                                      
                    |- feed_start_date: numeric                                                                                                                                               
                    |- feed_end_date: numeric                                                                                                                                                 
                    |- feed_version: string  
```

### frequencies
```
google-cloud-sdk/bin/bq show evaluacion02.frequencies
```
```
Table evaluacion02:evaluacion02.frequencies

   Last modified             Schema            Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- -------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:38:36   |- trip_id: string         13845        901248        21 Jun 03:38:36                                          901248                50339                          
                    |- start_time: string                                                                                                                                               
                    |- end_time: string                                                                                                                                                 
                    |- headway_secs: numeric                                                                                                                                            
                    |- exact_times: numeric 
```
### shapes
```
google-cloud-sdk/bin/bq show evaluacion02.shapes
```
```
Table evaluacion02:evaluacion02.shapes

   Last modified               Schema               Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- ------------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:42:08   |- shape_id: string             425947       16511580      21 Jun 03:42:08                                          16511580              2210076                        
                    |- shape_pt_lat: float                                                                                                                                                   
                    |- shape_pt_lon: float                                                                                                                                                   
                    |- shape_pt_sequence: numeric  
```

### stops
```
google-cloud-sdk/bin/bq show evaluacion02.stops
```
```
Table evaluacion02:evaluacion02.stops

   Last modified                Schema               Total Rows   Total Bytes     Expiration      Time Partitioning   Clustered Fields   Total Logical Bytes   Total Physical Bytes   Labels  
 ----------------- -------------------------------- ------------ ------------- ----------------- ------------------- ------------------ --------------------- ---------------------- -------- 
  21 Jun 02:43:30   |- stop_id: string               11957        831174        21 Jun 03:43:30                                          831174                370316                         
                    |- stop_code: string                                                                                                                                                      
                    |- stop_name: string                                                                                                                                                      
                    |- stop_lat: float                                                                                                                                                        
                    |- stop_lon: float                                                                                                                                                        
                    |- stop_url: string                                                                                                                                                       
                    |- wheelchair_boarding: string 
```





## Listar registros de tablas

### agency

```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT agency_id,
agency_name,
agency_url,
agency_timezone
FROM 
`evaluacion02.agency`'
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

### calendar
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT service_id,
monday,
tuesday,
wednesday,
thursday,
friday,
saturday,
sunday,
start_date
end_date
FROM 
`evaluacion02.calendar`'
```
```
+------------+--------+---------+-----------+----------+--------+----------+--------+----------+
| service_id | monday | tuesday | wednesday | thursday | friday | saturday | sunday | end_date |
+------------+--------+---------+-----------+----------+--------+----------+--------+----------+
| L          |      1 |       1 |         1 |        1 |      1 |        0 |    0.0 | 20240518 |
| S          |      0 |       0 |         0 |        0 |      0 |        1 |    0.0 | 20240518 |
| D          |      0 |       0 |         0 |        0 |      0 |        0 |    1.0 | 20240518 |
+------------+--------+---------+-----------+----------+--------+----------+--------+----------+
```

### calendar_dates
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT service_id,
date,
exception_type
FROM 
`evaluacion02.calendar_dates`'
```
```
+------------+----------+----------------+
| service_id |   date   | exception_type |
+------------+----------+----------------+
| D          | 20240521 |              1 |
| D          | 20240620 |              1 |
| D          | 20240629 |              1 |
| D          | 20240716 |              1 |
| D          | 20240815 |              1 |
| D          | 20240918 |              1 |
| D          | 20240919 |              1 |
| D          | 20240920 |              1 |
| D          | 20241012 |              1 |
| D          | 20241031 |              1 |
| D          | 20241101 |              1 |
| D          | 20241225 |              1 |
| L          | 20240521 |              2 |
| L          | 20240620 |              2 |
| L          | 20240629 |              2 |
| L          | 20240716 |              2 |
| L          | 20240815 |              2 |
| L          | 20240918 |              2 |
| L          | 20240919 |              2 |
| L          | 20240920 |              2 |
| L          | 20241012 |              2 |
| L          | 20241031 |              2 |
| L          | 20241101 |              2 |
| L          | 20241225 |              2 |
+------------+----------+----------------+
```
### feed_info
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT 
feed_publisher_name,
feed_publisher_url,
feed_lang,
feed_start_date,
feed_end_date,
feed_version
FROM 
`evaluacion02.feed_info`'
```
```
+---------------------+--------------------+-----------+-----------------+---------------+---------------+
| feed_publisher_name | feed_publisher_url | feed_lang | feed_start_date | feed_end_date | feed_version  |
+---------------------+--------------------+-----------+-----------------+---------------+---------------+
| Red Metropolitana   | http://www.red.cl  | es        |        20240518 |      20241231 | V123.20240518 |
+---------------------+--------------------+-----------+-----------------+---------------+---------------+
```

### frequencies
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT 
trip_id,
start_time,
end_time,
headway_secs,
exact_times
FROM 
`evaluacion02.frequencies` limit 5'
```
```
+-------------+------------+----------+--------------+-------------+
|   trip_id   | start_time | end_time | headway_secs | exact_times |
+-------------+------------+----------+--------------+-------------+
| 104-I-L-B07 | 14:00:00   | 16:30:00 |          346 |           0 |
| 104-R-L-B07 | 14:00:00   | 16:30:00 |          346 |           0 |
| 506-R-L-B07 | 14:00:00   | 16:30:00 |          346 |           0 |
| 105-R-S-B15 | 06:30:00   | 09:00:00 |          474 |           0 |
| 405-I-S-B15 | 06:30:00   | 09:00:00 |          474 |           0 |
+-------------+------------+----------+--------------+-------------+
```
### routes
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT 
route_id,
agency_id,
route_short_name,
route_long_name,
route_desc,
route_type,
route_url,
route_color,
route_text_color
FROM 
`evaluacion02.routes` limit 5'
```
```
+----------+-----------+------------------+-------------------------------------------------------+------------+------------+-----------------------------------------------------------+-------------+------------------+
| route_id | agency_id | route_short_name |                    route_long_name                    | route_desc | route_type |                         route_url                         | route_color | route_text_color |
+----------+-----------+------------------+-------------------------------------------------------+------------+------------+-----------------------------------------------------------+-------------+------------------+
| MTN      | MT        | MTN              | Tren Nos - Estación Central                           | NULL       | 0          | https://www.efe.cl/nuestros-servicios/metrotren-nos/      | 151CF3      | FFFFFF           |
| MTR      | MT        | MTR              | Tren Rancagua - Estación Central                      | NULL       | 0          | https://www.efe.cl/nuestros-servicios/metrotren-rancagua/ | F3B015      | 000000           |
| L1       | M         | L1               | Línea 1 (San Pablo - Los Dominicos)                   | NULL       | 1          | https://www.metro.cl/el-viaje/plano-de-red                | FA0727      | FFFFFF           |
| L3       | M         | L3               | Línea 3 (Plaza Quilicura - Fernando Castillo Velasco) | NULL       | 1          | https://www.metro.cl/el-viaje/plano-de-red                | 83441D      | FFFFFF           |
| L4A      | M         | L4A              | Línea 4A (La Cisterna - Vicuña Mackenna)              | NULL       | 1          | https://www.metro.cl/el-viaje/plano-de-red                | 0A5FCA      | FFFFFF           |
+----------+-----------+------------------+-------------------------------------------------------+------------+------------+-----------------------------------------------------------+-------------+------------------+
```

### shapes
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT 
shape_id,
shape_pt_lat,
shape_pt_lon,
shape_pt_sequence
FROM 
`evaluacion02.shapes` limit 5'
```
```
+----------+----------------+----------------+-------------------+
| shape_id |  shape_pt_lat  |  shape_pt_lon  | shape_pt_sequence |
+----------+----------------+----------------+-------------------+
| B04I     | -33.4199830005 | -70.6633130001 |               209 |
| B04I     | -33.4199830005 | -70.6633130001 |               308 |
| 214I     | -33.4199830005 | -70.6633130001 |               299 |
| B10I     | -33.4199830005 | -70.6633130001 |               204 |
| B10I     | -33.4199830005 | -70.6633130001 |               288 |
+----------+----------------+----------------+-------------------+
```
### stops
```
google-cloud-sdk/bin/bq query --use_legacy_sql=false 'SELECT 
stop_id,
stop_code,
stop_name,
stop_lat,
stop_lon,
stop_url,
wheelchair_boarding
FROM 
`evaluacion02.stops` limit 5'
```
```
+---------+-----------+----------------------------------------------------+-------------------+-------------------+----------+---------------------+
| stop_id | stop_code |                     stop_name                      |     stop_lat      |     stop_lon      | stop_url | wheelchair_boarding |
+---------+-----------+----------------------------------------------------+-------------------+-------------------+----------+---------------------+
| PB241   | NULL      | PB241-Parada / Mall Plaza Norte - Los Libertadores | -33.3640607810884 | -70.6813493519124 | NULL     | 0                   |
| PB184   | NULL      | PB184-Los Libertadores / Esq. Av. A. Vespucio      | -33.3668314015184 |   -70.68097565189 | NULL     | 0                   |
| PB185   | NULL      | PB185-Parada / Pasarela Albany                     | -33.3660777516853 | -70.6857970004004 | NULL     | 0                   |
| PB242   | NULL      | PB242-Parada 6 / (M) Los Libertadores              |  -33.366339735398 | -70.6896183397335 | NULL     | 0                   |
| PB186   | NULL      | PB186-Av. Independencia / Esq. H. De Iquique       | -33.3691429425543 | -70.6886829663555 | NULL     | 0                   |
+---------+-----------+----------------------------------------------------+-------------------+-------------------+----------+---------------------+
```