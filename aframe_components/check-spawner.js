/*
check-spawner.js
Author: Alexandros Lotsos
Summary: a check-spawner component that does nothing on startup.
Has a targetCount value that is incremented by elements in the scene that have the updater component when they're scanned.
Once the targetCount value reaches a predetermined limit, the user is allowed to spawn a certain number of a model onto the scene.
*/

AFRAME.registerComponent('check-spawner', {
    schema: {
        modelID: {
            type: 'string',
            default: ''
        },
        modelScale: {
            type: 'vec3',
            default: {
                x: 1,
                y: 1,
                z: 1
            }
        },
        modelRotation: {
            type: 'vec3',
            default: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        targetLimit: {
            type: 'int',
            default: 1
        },
        modelLimit: {
            type: 'int',
            default: 1
        }
    },
    init: function () {

        //bind this to spawnModel so it functions properly
        const data = this;
        this.spawnModel = this.spawnModel.bind(data);

    },
    spawnModel: function (event) {
        const model = document.createElement('a-entity');
        const touchPoint = event.detail.intersection.point; //get a reference to the touch point

        //set the initial position rotation and scale of the original model
        model.setAttribute('position', touchPoint);
        model.setAttribute('rotation', this.data.modelRotation);
        model.setAttribute('scale', this.data.modelScale);

        console.log(this.data);
        //attach the specified gltf model to the entity
        model.setAttribute('gltf-model', this.data.modelID);

        model.setAttribute('visible', 'true');

        //give it the cantap class and the placeModel id for reference
        model.className += "cantap";
        model.id = "placeModel";

        //attach the model to the scene
        document.querySelector('#mainScene').appendChild(model);

        //give the model the drag rotate and scale components
        model.setAttribute('hold-drag', '');
        model.setAttribute('pinch-scale', '');
        model.setAttribute('two-finger-spin', '');

        //increment the model count and check to see if the spawner should be disabled
        this.modelCount++;
        this.removeSpawner();
    },
    removeSpawner: function () {
        const ground = document.querySelector('#ground');

        if (this.modelCount >= this.data.modelLimit) {
            ground.removeEventListener('click', this.spawnModel);
            this.removePlace();
        }
    },
    increment: function () {
        //increment the targetCount
        this.targetCount++;
        console.log(this.targetCount);

        //calculate progress for cosmetic progress bar
        let progress = this.targetCount/this.data.targetLimit;
        progress = progress.toFixed(2) * 100;
        console.log(progress);

        //update the progress bar
        const progressEl = document.querySelector('.progress-container').children;
        progressEl[0].style.width = `${progress}%`;
        progressEl[1].innerHTML = `${progress}%`;

        //check to see if the spawner should be enabled
        if(this.targetCount === this.data.targetLimit){
            const ground = document.querySelector('#ground');
            ground.addEventListener('click', this.spawnModel);

            //remove the generate image targets component from the scene and hide the checkmarks
            this.el.sceneEl.removeAttribute('xrextras-generate-image-targets');
            const checkmarks = document.querySelectorAll('checkmark-primitive');
            for(let i = 0; i < checkmarks.length; i++){
                this.el.sceneEl.removeChild(checkmarks[i]);
            }
            console.log(checkmarks);

            this.removeFit();
        }
    },
    decrement: function () {
        console.log("value has been decremented");
    },
    removeFit: function () {
        //find the progress bar container and disable it
        const progressContainer = document.querySelector('.progress-container');
        progressContainer.style.display = "none";
        //find the scene complete container and enable it
        const completeContainer = document.querySelector('.scene-complete-container');
        completeContainer.style.display = "block";
        //find the fit to frame container and disable it
        const fitToFrame = document.querySelector('.fit-to-frame');
        fitToFrame.style.display = "none";
        //find the tap to place container and enable it
        const tapToPlace = document.querySelector('.tap-to-place');
        tapToPlace.style.display = "flex";
    },
    removePlace: function() {
        //find the scene complete container and disable it
        const sceneComplete = document.querySelector('.scene-complete-container');
        sceneComplete.style.display = "none";
        //find the tap to place container and disable it
        const tapToPlace = document.querySelector('.tap-to-place');
        tapToPlace.style.display = "none";
        //find the scene placed container and enabled it
        const scenePlaced = document.querySelector('.scene-placed-container');
        scenePlaced.style.display = "block";

    },
    modelCount: 0,
    targetCount: 0
});