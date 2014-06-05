#! /bin/sh

# Updating initial files, when more or modified observation tables have been ingested, in order to make them visible in sianctdemo.

# The files are read into the sianctdemo page at startup.

# The alternative would be to run the curl commands dynamically at startup, which would delay the startup much.

# Update the initial project structure

curl -u sianctdemouserofsianct:sianctdemouserofsianctpassword "http://127.0.0.1:8082/sianct/sianctGetProjectStructure/sianctProjectStructureToHtml.xslt" > sianctdemoProjectStructure.html

# Update the initial species names

~$ curl  -u sianctdemouserofsianct:sianctdemouserofsianctpassword "http://127.0.0.1:8082/sianct/sianctGetSpecies" > sianctdemoAllSpeciesNames.html 

exit 0
