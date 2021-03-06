import { Component } from '@angular/core';
import { Api } from '../../providers/api';
import { LibraryGenerationStatus } from '../../interfaces/library-generation-status';
import { Source } from '../../interfaces/source';
import { Util } from '../../providers/util';
import { Alerter } from '../../providers/alerter';
@Component({
    selector: 'page-admin',
    templateUrl: 'admin.html',
    styleUrls: ['admin.scss']
})
export class AdminPage {

    constructor(
        public api: Api,
        private util: Util,
        private alerter: Alerter
    ) {
        this.init();
    }
    private async init() {
        this.isCheckingStatus = true;
        this.monitorStatus();
        this.sources = await this.api.sources.getAll();
    }
    public libraryStatus: LibraryGenerationStatus;
    public isCheckingStatus: boolean;

    public get generateLibraryButtonIsVisible() {
        return this.isLibGenRequestProcessing === false &&
            this.isCheckingStatus === false;
    }

    /**
     * anytime the page is activated
     */
    public ionViewDidEnter() {
        this.monitorStatus();
    }

    public isLibGenRequestProcessing = false;

    public async generateLibrary() {
        this.isLibGenRequestProcessing = true;
        this.libraryStatus = await this.api.library.generate();
        this.monitorStatus();
        this.isLibGenRequestProcessing = false;
    }

    public async monitorStatus() {
        let interval = 0;
        try {
            if (!this.isCheckingStatus) {
                this.isCheckingStatus = true;
                this.libraryStatus = undefined;
                await this.util.timeoutAsync(interval);
                //set the interval AFTER the first check
                interval = 2000;
                this.libraryStatus = await this.api.library.getStatus();
                while (this.libraryStatus && this.libraryStatus.isProcessing) {
                    this.libraryStatus = await this.api.library.getStatus();
                    await this.util.timeoutAsync(interval);
                }
            }
        } catch (e) {
            this.alerter.alert(JSON.stringify(e));
        } finally {
            this.isCheckingStatus = false;
        }
    }

    public get lastGeneratedDateDifference() {
        if (!this.libraryStatus || !this.libraryStatus.lastGeneratedDate) {
            return undefined;
        }
        return this.util.getDateDifference(new Date(this.libraryStatus.lastGeneratedDate), new Date());
    }

    public getTimeRemaining() {
        if (!this.libraryStatus || this.libraryStatus.secondsRemaining === null) {
            return 'calculating time';
        }
        if (this.libraryStatus.isProcessing === false) {
            return null;
        }
        let endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + this.libraryStatus.secondsRemaining);
        let description = this.util.getDateDifference(new Date(), endDate);
        if (description !== '') {
            return description;
        } else {
            return 'less than a minute';
        }
    }

    public get percentage() {
        if (!this.libraryStatus) {
            return null;
        }
        let percentage = Math.floor((this.libraryStatus.countCompleted / this.libraryStatus.countTotal) * 100);
        return percentage;
    }

    public sources: Source[];

}
