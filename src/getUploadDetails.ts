import * as _ from 'lodash';
import { UploadDetails } from '.';

export const getUploadDetails: (document: Document) => UploadDetails | null = () => {
    const uploadUrlInput = document.getElementById("uploadUrlInput") as HTMLInputElement;
    const authTokenInput = document.getElementById("authTokenInput") as HTMLInputElement;
    const uploadFileInput = document.getElementById("uploadFileInput") as HTMLInputElement;

    const uploadUrlValid =
        !_.isNil(uploadUrlInput) && uploadUrlInput.value.length > 0;
    const fileValid =
        !_.isNil(uploadFileInput) && uploadFileInput.value.length > 0;
    const authTokenValid =
        !_.isNil(authTokenInput) && authTokenInput.value.length > 0;

    if (uploadUrlValid && fileValid && authTokenValid) {
        return {
            uploadUrl: uploadUrlInput.value,
            fileUri: uploadFileInput.value,
            authToken: authTokenInput.value
        };
    }

    return null;
};
