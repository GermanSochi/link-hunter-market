import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Политика конфиденциальности — AI-маркет" };

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Политика конфиденциальности</h1>
        <p className="text-sm text-gray-400 mb-10">Последнее обновление: 1 мая 2026 г.</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Общие положения</h2>
            <p className="text-gray-600">
              Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок сбора,
              хранения, использования и передачи персональных данных пользователей платформы AI-маркет
              (далее — «Платформа», «Сервис»). Политика разработана в соответствии с требованиями
              Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
            <p className="text-gray-600 mt-3">
              Используя Сервис, вы даёте согласие на обработку ваших персональных данных
              в соответствии с настоящей Политикой.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Оператор персональных данных</h2>
            <p className="text-gray-600">
              Оператором персональных данных является владелец Платформы AI-маркет.
              Контактный адрес для вопросов о персональных данных:{" "}
              <a href="mailto:privacy@aimarket.dev" className="text-[#005BFF] hover:underline">
                privacy@aimarket.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Какие данные мы собираем</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600">
              <li><strong>Регистрационные данные:</strong> email-адрес, имя пользователя, пароль (в хэшированном виде)</li>
              <li><strong>Данные OAuth:</strong> имя, email, аватар при авторизации через Google, GitHub, Яндекс</li>
              <li><strong>Финансовые данные:</strong> история транзакций внутри Платформы (не данные банковских карт)</li>
              <li><strong>Технические данные:</strong> IP-адрес, User-Agent браузера, время посещений, cookie</li>
              <li><strong>Контент:</strong> публикуемые посты, отзывы, сообщения в чатах</li>
              <li><strong>Настройки:</strong> выбранные интересы, настройки уведомлений</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Цели обработки персональных данных</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600">
              <li>Предоставление доступа к функциям Платформы и исполнение договора</li>
              <li>Идентификация и аутентификация пользователей</li>
              <li>Обработка платежей и ведение финансовой документации</li>
              <li>Персонализация ленты и рекомендаций</li>
              <li>Обеспечение безопасности и предотвращение мошенничества</li>
              <li>Направление уведомлений, связанных с работой Сервиса</li>
              <li>Исполнение требований законодательства РФ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Правовые основания обработки</h2>
            <p className="text-gray-600">
              Обработка персональных данных осуществляется на основании:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 mt-2">
              <li>Согласия субъекта персональных данных (ст. 6 ч. 1 п. 1 ФЗ-152)</li>
              <li>Исполнения договора, стороной которого является пользователь (ст. 6 ч. 1 п. 5 ФЗ-152)</li>
              <li>Исполнения обязанностей, предусмотренных законодательством РФ (ст. 6 ч. 1 п. 2 ФЗ-152)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Cookies и аналогичные технологии</h2>
            <p className="text-gray-600">
              Платформа использует cookie-файлы для обеспечения работы сессий аутентификации,
              хранения пользовательских предпочтений и аналитики. Вы можете настроить браузер
              на отклонение cookie, однако это может повлечь ограничение функциональности Сервиса.
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Типы cookie:</strong> сессионные (необходимые для входа), функциональные
              (настройки), аналитические (улучшение Сервиса). Аналитические cookie используются
              только при наличии вашего согласия.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Трансграничная передача данных</h2>
            <p className="text-gray-600">
              Данные хранятся на серверах Neon Technology Inc. (США) и Vercel Inc. (США).
              Трансграничная передача осуществляется в соответствии с главой 4.1 ФЗ-152.
              До начала трансграничной передачи мы обеспечиваем надлежащую защиту прав субъектов
              персональных данных иностранным государством-получателем. Данные не передаются
              третьим лицам без согласия пользователя, за исключением случаев, предусмотренных законом.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Сроки хранения данных</h2>
            <p className="text-gray-600">
              Персональные данные хранятся на протяжении действия пользовательского соглашения
              и в течение 3 лет после его прекращения, если иные сроки не установлены законодательством РФ.
              Финансовые записи хранятся в соответствии с требованиями налогового законодательства (5 лет).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Права субъектов персональных данных</h2>
            <p className="text-gray-600">В соответствии с ФЗ-152 вы вправе:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 mt-2">
              <li>Получить сведения об обработке ваших персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Обратиться с жалобой в Роскомнадзор (rkn.gov.ru)</li>
            </ul>
            <p className="text-gray-600 mt-2">
              Для реализации прав направьте запрос на{" "}
              <a href="mailto:privacy@aimarket.dev" className="text-[#005BFF] hover:underline">
                privacy@aimarket.dev
              </a>
              . Срок ответа — 30 дней.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Меры защиты данных</h2>
            <p className="text-gray-600">
              Мы применяем шифрование передаваемых данных (TLS), хэширование паролей (bcrypt),
              ограниченный доступ сотрудников к данным пользователей, регулярный аудит безопасности.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Изменения Политики</h2>
            <p className="text-gray-600">
              Мы вправе вносить изменения в настоящую Политику. При существенных изменениях
              уведомим пользователей по email или через уведомление на сайте. Продолжение
              использования Сервиса после изменений означает согласие с новой редакцией.
            </p>
          </section>

          <section className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">
              <strong>Регистрация в Роскомнадзоре:</strong> Платформа зарегистрирована как оператор
              персональных данных в соответствии с требованиями ФЗ-152. По вопросам защиты данных
              обращайтесь на{" "}
              <a href="mailto:privacy@aimarket.dev" className="text-[#005BFF] hover:underline">
                privacy@aimarket.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
