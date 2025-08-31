import { initializeIcons } from '@fluentui/react/lib/Icons';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { Grid } from './Grid';

// Register icons - but ignore warnings if they have been already registered by Power Apps
initializeIcons(undefined, { disableWarnings: true });

export class ModelDrivenGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    container: HTMLDivElement;
    context: ComponentFramework.Context<IInputs>;
    sortedRecordsIds: string[] = [];
    resources: ComponentFramework.Resources;
    isTestHarness: boolean;
    records: {
        [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
    };
    currentPage = 1;

    setSelectedRecords = (ids: string[]): void => {
        this.context.parameters.records.setSelectedRecordIds(ids);
    };

    createGermanResourceFallback = (): void => {
        // German label mappings
        const germanLabels: { [key: string]: string } = {
            'ThumbnailSizePixel_Disp': 'Thumbnail Größe (px)',
            'ThumbnailSizePixel_Desc': 'Die Größe des Thumbnails in Pixeln',
            'Records_Dataset_Display': 'Datensätze',
            'FilteredRecordCount_Disp': 'Gefilterte Datensatzanzahl',
            'FilteredRecordCount_Desc': 'Anzahl der Datensätze nach dem Filtern',
            'HighlightValue_Disp': 'Hervorhebungswert',
            'HighlightValue_Desc': 'Der Wert, der angibt, dass eine Zeile hervorgehoben werden soll',
            'HighlightColor_Disp': 'Hervorhebungsfarbe',
            'HighlightColor_Desc': 'Die Farbe zum Hervorheben einer Zeile',
            'HighlightIndicator_Disp': 'Hervorhebungsindikator-Feld',
            'HighlightIndicator_Desc': 'Legen Sie den Namen des Feldes fest, das mit dem Hervorhebungswert verglichen werden soll',
            'Label_Grid_Footer': 'Seite {0}',
            'Label_SortAZ': 'A bis Z',
            'Label_SortZA': 'Z bis A',
            'Label_DoesNotContainData': 'Enthält keine Daten',
            'Label_Grid_Footer_RecordCount': '{0} Datensätze ({1} ausgewählt)',
            'SubGridHeight_Disp': 'Untergitter-Höhe (leer lassen, wenn nicht zum Formular hinzugefügt)',
            'SubGridHeight_Desc': 'Die Höhe in Pixel, um das Gitter darzustellen, wenn es auf einem Formular-Untergitter konfiguriert ist. Leer lassen, wenn nicht zum Formular hinzugefügt.',
            'Label_NoRecords': 'Keine Datensätze gefunden'
        };

        // Override the getString method to always return German labels
        const originalGetString = this.resources.getString.bind(this.resources);
        this.resources.getString = (key: string): string => {
            return germanLabels[key] || originalGetString(key);
        };
    };

    onNavigate = (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): void => {
        if (item) {
            this.context.parameters.records.openDatasetItem(item.getNamedReference());
        }
    };

    onSort = (name: string, desc: boolean): void => {
        const sorting = this.context.parameters.records.sorting;
        while (sorting.length > 0) {
            sorting.pop();
        }
        this.context.parameters.records.sorting.push({
            name: name,
            sortDirection: desc ? 1 : 0,
        });
        this.context.parameters.records.refresh();
    };

    onFilter = (name: string, filter: boolean): void => {
        const filtering = this.context.parameters.records.filtering;
        if (filter) {
            filtering.setFilter({
                conditions: [
                    {
                        attributeName: name,
                        conditionOperator: 12, // Does not contain Data
                    },
                ],
            } as ComponentFramework.PropertyHelper.DataSetApi.FilterExpression);
        } else {
            filtering.clearFilter();
        }
        this.context.parameters.records.refresh();
    };

    loadFirstPage = (): void => {
        this.currentPage = 1;
        this.context.parameters.records.paging.loadExactPage(1);
    };

    loadNextPage = (): void => {
        this.currentPage++;
        this.context.parameters.records.paging.loadExactPage(this.currentPage);
    };

    loadPreviousPage = (): void => {
        this.currentPage--;
        this.context.parameters.records.paging.loadExactPage(this.currentPage);
    };



    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.resources = this.context.resources;
        this.isTestHarness = document.getElementById('control-dimensions') !== null;

        // Create a custom getString method that always returns German labels
        this.createGermanResourceFallback();

        this.context.parameters.records.loading = true;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const dataset = context.parameters.records;
        const paging = context.parameters.records.paging;

        // In MDAs, the initial population of the dataset does not provide updatedProperties
        const initialLoad = !this.sortedRecordsIds && dataset.sortedRecordIds;
        const datasetChanged = context.updatedProperties.indexOf('dataset') > -1 || initialLoad;
        const pagingChanged = context.updatedProperties.indexOf('paging') > -1;
        const resetPaging =
            datasetChanged && !dataset.loading && !dataset.paging.hasPreviousPage && this.currentPage !== 1;

        if (resetPaging) {
            this.currentPage = 1;
        }

        // Always update records and paging state when loading is complete
        if (resetPaging || datasetChanged || pagingChanged || this.isTestHarness || !this.records || !dataset.loading) {
            this.records = dataset.records;
            this.sortedRecordsIds = dataset.sortedRecordIds;
            
            // Force loading to false if we have records
            if (dataset.sortedRecordIds?.length > 0) {
                dataset.loading = false;
            }
        }


        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);



        ReactDOM.render(
            React.createElement(Grid, {
                width: allocatedWidth,
                columns: dataset.columns,
                records: this.records,
                sortedRecordIds: this.sortedRecordsIds,
                hasNextPage: paging.hasNextPage,
                hasPreviousPage: paging.hasPreviousPage,
                currentPage: this.currentPage,
                totalResultCount: paging.totalResultCount,
                sorting: dataset.sorting,
                filtering: dataset.filtering && dataset.filtering.getFilter(),
                resources: this.resources,
                itemsLoading: dataset.loading,
                setSelectedRecords: this.setSelectedRecords,
                onNavigate: this.onNavigate,
                onSort: this.onSort,
                onFilter: this.onFilter,
                loadFirstPage: this.loadFirstPage,
                loadNextPage: this.loadNextPage,
                loadPreviousPage: this.loadPreviousPage,
            }),
            this.container,
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {} as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container);
    }
}
