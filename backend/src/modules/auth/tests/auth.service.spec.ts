import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { TestService } from '../../../libs/test/test.service';
import { AuthError } from '../auth.common';
import { AuthService } from '../auth.service';
import { SignInDto } from '../models/dto/sign-in.dto';
import { SignUpDto } from '../models/dto/sign-up.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    authService = app.get(AuthService);
    await app.init();
  });

  afterAll(async () => {
    const testService = app.get(TestService);
    await testService.afterAll();
    await app.close();
  });

  it('should create a user on successful signup', async () => {
    const signUpDto = new SignUpDto();
    signUpDto.username = 'new-user111111';
    signUpDto.password = 'valid-password';

    const res = await authService.signUp(signUpDto);
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });

  it('should throw an error for username already existing', async () => {
    const signUpDto = new SignUpDto();
    signUpDto.username = 'new-user111111';
    signUpDto.password = 'valid-password123123';

    await expect(authService.signUp(signUpDto)).rejects.toThrowError(
      AuthError.USER_ALREADY_EXIST
    );
  });

  it('should return a token on successful signin', async () => {
    const signInDto = new SignInDto();
    signInDto.username = 'new-user111111';
    signInDto.password = 'valid-password';

    const res = await authService.signIn(signInDto);
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });

  it('should throw an error for password mismatch', async () => {
    const signInDto = new SignInDto();
    signInDto.username = 'new-user111111';
    signInDto.password = 'wrong-password';

    await expect(authService.signIn(signInDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });



  it('should throw an error for password mismatch', async () => {
    const signInDto = new SignInDto();
    signInDto.username = 'new-user111111';
    signInDto.password = 'wrong-password';

    await expect(authService.signIn(signInDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

});
