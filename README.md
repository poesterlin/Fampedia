# Fampedia

## Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/a72c4645-2ef7-4cce-ac81-732f691f1813/deploy-status)](https://app.netlify.com/sites/competent-cray-989081/deploys)
![coverage](https://gitlab.com/philipOE/fampedia/badges/dev/coverage.svg)


![Fampedia Logo](/logo.png)

This is the repository for the SQUAD project from the `University of Applied Science in Mannheim` with `Susi & James` as our sponsor. In this repository you can find everything about our product, `Fampedia`.
`Fampedia` was created to bring families together.
Our task was to develop a product that is related to graveyards. After a lot of research we figured out, that the potential in creating a product to directly related to graveyards is the way to go. Therefore we focused on something that isn't, but can be related to graveyards. After more research and interviews we came up with Fampedia as our best idea. With Fampedia, a familiy can create their own private space, where they can create moments and attach photos to them. Other family members can than comment on those moments or even add additional photos.


## Getting Started

The following instructions will enable you to set up a copy of our project and run it on a machine for development and testing purposes.
See deployment in the frontend README.md file for notes on how to deploy the project on a live system.

To start off, you'll need to grab a copy of our repository:
```
$ git clone https://gitlab.com/philipOE/fampedia.git
```

### Prerequisites

* It is mandatory to install docker before you use our software:     
Linux:   
``
sudo apt-get install docker    
``     
[Windows](https://docs.docker.com/docker-for-windows/install/)      
* Our software uses MongoDB as a database, removing the need to change anything when you use the docker-compose file.
* To be able to use all functionality that `Fampedia`provides, make sure to have a domain that can be used to create a valid https certificate on the production server. The certificate keys need to be stored in the root directory (backend).

### Installing

Thanks to docker, all you need to do is run the next command:
```
docker-compose up
```

## SQUAD Members

* **Christian Coenen** - [find me here](https://www.linkedin.com/in/christian-coenen/)
* **Philip Oesterlin** - [find me here](https://github.com/PhilipOe1612340)
* **Tim Schäfer** - [find me here](https://www.linkedin.com/in/tim-sch%C3%A4fer-266b59149/)
* **Teresa Lacerda** - [find me here](https://www.linkedin.com/in/teresa-lacerda/)
* **Pedro Ribeiro** - [find me here](https://www.linkedin.com/in/pedro-ribeiro-3111a9157/)


## Acknowledgments

* Thanks a lot to the whole `inno.space` team and our sponsor `Susi & James` for supporting us.
It would be an honor to work with you again.


## Setup
Setup documentation can be found [here](Docs/Setup.md)

