import type { RenderResult } from '@testing-library/vue';
import { fireEvent, render } from '@testing-library/vue';
import { random } from '@withshepherd/faker';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Quasar } from 'quasar';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { VueQueryPlugin } from 'vue-query';
import type { ResponseDto } from '~/apis/@types';
import { DEV_API_URL } from '~/constants';
import { i18n } from '~/plugins/i18n';
import { quasarOptions } from '~/plugins/quasar';
import { router } from '~/router';
import type { ICreateRoomTypeMutationVariables } from '../apis/useCreateRoomTypeMutation';
import type { IRoomTypeListQueryResDatum } from '../apis/useRoomTypeListQuery';
import { IUpdateRoomTypeMutationVariables } from '../apis/useUpdateRoomTypeMutation';
import type { Props } from './room-type-form.vue';
import RoomTypeForm from './room-type-form.vue';

//====================================
// CONSTANTS
//
// Control response of the POST/CREATE request via Room Name
//====================================
const ROOM_TYPE_CODE = {
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
  rest.post<ICreateRoomTypeMutationVariables>(
    `${DEV_API_URL}/configuration/room/createRoomType`,
    ({ body }, res, ctx) => {
      console.log('POST');
      if (body.code === ROOM_TYPE_CODE.FAIL) return res(ctx.status(500));
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
  rest.post<IUpdateRoomTypeMutationVariables>(
    `${DEV_API_URL}/configuration/room/updateRoomType`,
    ({ body }, res, ctx) => {
      console.log('POST');
      if (body.code === ROOM_TYPE_CODE.FAIL) return res(ctx.status(500));
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

describe('RoomTypeForm', () => {
  expect(RoomTypeForm).toBeTruthy();

  describe('NewRoomTypeForm', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    const props: Props = { roomTypeSn: 'new' };

    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(RoomTypeForm, {
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

    it('should have initial values', async () => {
      const fields = [
        { label: 'Number of Beds', initialValue: '1' },
        { label: 'Number of Adults', initialValue: '2' },
        { label: 'Number of Children', initialValue: '0' },
      ];

      await Promise.all(
        fields.map(async ({ initialValue, label }) => {
          const input = await wrapper.findByLabelText<HTMLInputElement>(label);
          expect(input).to.exist;
          expect(input.value).to.eq(initialValue);
          return;
        }),
      );
    });

    it('should validate Room Type Code', async () => {
      let errMsg: HTMLElement;
      const input = await wrapper.findByLabelText<HTMLInputElement>('Room Type Code');
      expect(input).to.exist;

      await fireEvent.update(input, random.alphaNumeric(11));
      errMsg = await wrapper.findByText('This value is too long');
      expect(errMsg).to.exist;

      await fireEvent.update(input, '');
      errMsg = await wrapper.findByText('This field is required');
      expect(errMsg).to.exist;
    });

    it('should validate Room Type Name', async () => {
      let errMsg: HTMLElement;
      const input = await wrapper.findByLabelText<HTMLInputElement>('Room Type Name');
      expect(input).to.exist;

      await fireEvent.update(input, random.alphaNumeric(51));
      errMsg = await wrapper.findByText('This value is too long');
      expect(errMsg).to.exist;

      await fireEvent.update(input, '');
      errMsg = await wrapper.findByText('This field is required');
      expect(errMsg).to.exist;
    });

    it('should validate on click submit button', async () => {
      const roomTypeInput = await wrapper.findByLabelText<HTMLInputElement>('Room Type Code');
      expect(roomTypeInput).to.exist;
      await fireEvent.update(roomTypeInput, random.alphaNumeric(10));

      const submitButton = await wrapper.findByTestId<HTMLButtonElement>('submit-btn');
      await fireEvent.click(submitButton);

      const errMsg = await wrapper.findAllByText('This field is required');
      expect(errMsg).to.exist;
    });
  });
});
