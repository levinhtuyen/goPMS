import { fireEvent, render, RenderResult } from '@testing-library/vue';
import { random } from '@withshepherd/faker';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Quasar } from 'quasar';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { VueQueryPlugin } from 'vue-query';
import type { ResponseDto } from '~/apis/@types';
import { DEV_API_URL } from '~/constants';
import type { ISignInMutationVariables } from '~/modules/auth/apis/useSignInMutation';
import { i18n } from '~/plugins/i18n';
import { quasarOptions } from '~/plugins/quasar';
import { router } from '~/router';
import type { IRoomTypeFloorInfoQueryResDatum } from '../apis/useRoomTypeFloorInfoQuery';
import type { IRoomTypeListQueryResDatum } from '../apis/useRoomTypeListQuery';
import type { IUpdateRoomMutationVariables } from '../apis/useUpdateRoomMutation';
import type { Props } from './room-form.vue';
import RoomForm from './room-form.vue';

//====================================
// CONSTANTS
//
// Control response of the POST/CREATE request via Room Name
//====================================
const ROOM_NAME = {
  SUCCESS: 'SEND_SUCCESS_RESPONSE',
  FAIL: 'SEND_FAIL_RESPONSE',
};

//====================================
// MOCK SERVER
//====================================

const server = setupServer(
  //
  // GET REQUESTS
  //
  rest.get<ISignInMutationVariables>(
    `${DEV_API_URL}/configuration/room/getRoomTypeFloorInfo`,
    (_, res, ctx) => {
      const resBody: ResponseDto<IRoomTypeFloorInfoQueryResDatum[]> = {
        code: 1,
        error: null,
        message: '',
        timestamp: new Date().getTime(),
        data: [
          { sn: 1, name: 'FLOOR-1', roomList: [{ sn: 1, name: 'ROOM-1', roomTypeCode: 'CODE-1' }] },
        ],
      };
      return res(ctx.json(resBody));
    },
  ),
  rest.get(`${DEV_API_URL}/configuration/room/getRoomTypeList`, (_, res, ctx) => {
    const resBody: ResponseDto<IRoomTypeListQueryResDatum[]> = {
      code: 1,
      error: null,
      message: '',
      timestamp: new Date().getTime(),
      data: [
        {
          sn: 1,
          code: 'CODE-1',
          name: 'NAME-1',
          numOfRoom: 1,
          numOfChildren: 0,
          numOfAdult: 2,
          numOfBed: 1,
        },
      ],
    };

    return res(ctx.json(resBody));
  }),
  //
  // POST REQUEST
  //
  rest.post<IUpdateRoomMutationVariables>(
    `${DEV_API_URL}/configuration/room/updateRoom`,
    ({ body }, res, ctx) => {
      if (body.name === ROOM_NAME.FAIL) return res(ctx.status(500));
      const resBody: ResponseDto<null> = {
        code: 1,
        error: null,
        message: '',
        timestamp: new Date().getTime(),
        data: null,
      };

      return res(ctx.json(resBody));
    },
  ),
);

//====================================
// UNIT TEST
//====================================

describe('RoomForm', () => {
  expect(RoomForm).toBeTruthy();

  describe('NewRoomForm', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    const props: Props = { roomSn: 'new' };

    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(RoomForm, {
        global: { plugins: [[Quasar, quasarOptions], i18n, router, VueQueryPlugin] },
        props,
      });
    });

    it('should have a submit button', async () => {
      const submitButton = await wrapper.findByTestId('submit-btn');
      expect(submitButton).to.exist;
      expect(submitButton.textContent).to.equal('Save');
      expect(submitButton.getAttribute('type')).to.equal('submit');
    });

    it('should validate Room Name', async () => {
      let errMsg: HTMLElement;
      const input = await wrapper.findByLabelText<HTMLInputElement>('Room Name');
      expect(input).to.exist;

      await fireEvent.update(input, random.alphaNumeric(51));
      errMsg = await wrapper.findByText('This value is too long');
      expect(errMsg).to.exist;

      await fireEvent.update(input, '');
      errMsg = await wrapper.findByText('This field is required');
      expect(errMsg).to.exist;
    });

    it('should validate on click submit button', async () => {
      const input = await wrapper.findByLabelText<HTMLInputElement>('Room Name');
      expect(input).to.exist;
      await fireEvent.update(input, random.alphaNumeric(5));

      const submitButton = await wrapper.findByTestId<HTMLButtonElement>('submit-btn');
      await fireEvent.click(submitButton);

      const errMsg = await wrapper.findAllByText('This field is required');
      expect(errMsg).to.exist;
    });
  });

  describe('EditRoomForm', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    const props: Props = { roomSn: 1 };

    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(RoomForm, {
        global: { plugins: [[Quasar, quasarOptions], i18n, router, VueQueryPlugin] },
        props,
      });
    });

    it('should enable Room Name field', async () => {
      const nameInput = await wrapper.findByDisplayValue('ROOM-1');
      expect(nameInput).to.exist;
      expect(nameInput.tagName.toLowerCase()).to.eq('input');
    });

    it('should disable Room Type field', async () => {
      const roomTypeSelect = await wrapper.findByText('CODE-1');
      expect(roomTypeSelect).to.exist;
      expect(roomTypeSelect.tagName.toLocaleLowerCase()).not.to.eq('select');
    });

    it('should disable Floor field', async () => {
      const floorSelect = await wrapper.findByText('FLOOR-1');
      expect(floorSelect).to.exist;
      expect(floorSelect.tagName.toLocaleLowerCase()).not.to.eq('select');
    });

    it('should notify update failure', async () => {
      const nameInput = await wrapper.findByDisplayValue('ROOM-1');
      await fireEvent.update(nameInput, ROOM_NAME.FAIL);

      const submitButton = await wrapper.findByTestId<HTMLButtonElement>('submit-btn');
      await fireEvent.click(submitButton);

      await wrapper.findByText('Failed to save');
    });

    it('should notify update success', async () => {
      const nameInput = await wrapper.findByDisplayValue('ROOM-1');
      await fireEvent.update(nameInput, ROOM_NAME.SUCCESS);

      const submitButton = await wrapper.findByTestId<HTMLButtonElement>('submit-btn');
      await fireEvent.click(submitButton);

      await wrapper.findByText('Saved');
    });
  });
});
