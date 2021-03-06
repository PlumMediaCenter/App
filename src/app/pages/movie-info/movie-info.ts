import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Api } from '../../providers/api';
import { Movie } from '../../interfaces/movie';
import { Toaster } from '../../providers/toaster';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-movie-info',
    templateUrl: 'movie-info.html',
    styleUrls: ['movie-info.scss']
})
export class MovieInfoPage implements OnInit {
    constructor(
        public activatedRoute: ActivatedRoute,
        public api: Api,
        public toaster: Toaster
    ) {
    }

    /**
     * Run all page initialization in this method so that this page can be refreshed simply by re-calling this function
     */
    public ngOnInit() {
        //access any parameters provided to the page through navParams.
        let movieId = this.activatedRoute.snapshot.params['id'];
        this.api.movies.getById(movieId).then((movie) => {
            this.movie = movie;
        }, (e) => {
            this.toaster.toast(`Error loading movie: ${JSON.stringify(e)}`);
            throw e;
        });
    }

    //give the template to the Math object
    public Math = Math;

    //TODO re-implement this somehow
    ionViewDidEnter() {
        //refresh this page anytime it is displayed
        this.ngOnInit();
    }

    /**
     * Determines whether the user had stopped a viewing session before the video was finished
     */
    public get isInProgress() {
        return this.movie.resumeSeconds > 0;
    }

    public movie: Movie;
}
