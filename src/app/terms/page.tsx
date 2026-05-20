import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Условия использования — AI-маркет" };

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Условия использования</h1>
        <p className="text-sm text-gray-400 mb-10">Последнее обновление: 1 мая 2026 г.</p>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Принятие условий</h2>
            <p className="text-gray-600">
              Используя Платформу AI-маркет, вы соглашаетесь с настоящими Условиями использования.
              Если вы не согласны с какими-либо условиями, вы обязаны прекратить использование Сервиса.
              Минимальный возраст для использования Сервиса — 18 лет.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Описание сервиса</h2>
            <p className="text-gray-600">
              AI-маркет — это цифровой маркетплейс для покупки и продажи AI-инструментов, скриптов,
              промптов, шаблонов и других цифровых продуктов. Платформа является посредником между
              продавцами и покупателями.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Регистрация и аккаунт</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600">
              <li>Вы обязуетесь предоставить достоверные данные при регистрации</li>
              <li>Ответственность за безопасность пароля лежит на вас</li>
              <li>Запрещено создавать несколько аккаунтов или использовать чужие данные</li>
              <li>При подозрении на несанкционированный доступ незамедлительно сообщите нам</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Правила для продавцов</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600">
              <li>Продавец гарантирует, что является правообладателем продаваемого контента</li>
              <li>Запрещено продавать вредоносный код, нелегальный контент, плагиат</li>
              <li>Продукты проходят модерацию перед публикацией</li>
              <li>Комиссия Платформы составляет 5% от суммы сделки</li>
              <li>Продавец несёт полную ответственность за качество и описание своих продуктов</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Правила для покупателей</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600">
              <li>Цифровые продукты передаются покупателю после подтверждения оплаты</li>
              <li>Возврат возможен в течение 30 дней при наличии обоснованных претензий к качеству</li>
              <li>Запрещено перепродавать приобретённые продукты без письменного согласия продавца</li>
              <li>Лицензия на использование продукта является персональной</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Запрещённый контент</h2>
            <p className="text-gray-600">На Платформе запрещено публиковать:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 mt-2">
              <li>Вредоносное программное обеспечение, вирусы, шпионские программы</li>
              <li>Контент, нарушающий права интеллектуальной собственности</li>
              <li>Материалы, пропагандирующие насилие, дискриминацию, экстремизм</li>
              <li>Персональные данные третьих лиц без их согласия</li>
              <li>Контент, нарушающий законодательство Российской Федерации</li>
              <li>Спам, фишинг и мошеннические схемы</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Внутренняя валюта (монеты)</h2>
            <p className="text-gray-600">
              Платформа использует внутренние монеты (1 монета = 1 рубль РФ) для расчётов между
              пользователями. Монеты не являются электронными денежными средствами в смысле
              ФЗ-161 и используются исключительно внутри Платформы.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Ограничение ответственности</h2>
            <p className="text-gray-600">
              Платформа не несёт ответственности за качество продуктов продавцов. Сервис
              предоставляется «как есть» без гарантий бесперебойной работы. Максимальная
              ответственность Платформы не превышает суммы, уплаченной пользователем за последние
              12 месяцев.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Блокировка аккаунтов</h2>
            <p className="text-gray-600">
              Мы вправе заблокировать аккаунт при нарушении настоящих Условий. При систематических
              нарушениях или мошенничестве аккаунт может быть удалён без предупреждения.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Применимое право</h2>
            <p className="text-gray-600">
              Настоящие Условия регулируются законодательством Российской Федерации.
              Споры рассматриваются в суде по месту нахождения Платформы.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Контакты</h2>
            <p className="text-gray-600">
              По вопросам, связанным с Условиями использования:{" "}
              <a href="mailto:legal@aimarket.dev" className="text-[#005BFF] hover:underline">
                legal@aimarket.dev
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
